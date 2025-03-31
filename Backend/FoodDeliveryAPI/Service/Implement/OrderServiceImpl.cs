using AutoMapper;
using AutoMapper.QueryableExtensions;
using Azure.Core;
using BusinessObjects;
using BusinessObjects.Dtos.Order.Request;
using BusinessObjects.Dtos.Order.Response;
using FoodDeliveryAPI.Exceptions;
using FoodDeliveryAPI.Repository;
using static BusinessObjects.Enums.OrderEnums;

namespace FoodDeliveryAPI.Service.Implement
{
	public class OrderServiceImpl : IOrderService
	{
		private readonly OrderRepository _orderRepo;
		private readonly CartRepository _cartRepo;
		private readonly CartItemRepository _cartItemRepo;
		private readonly ApplicationDBContext _context;
		private readonly ShopRepository _shopRepo;
		private readonly IMapper _mapper;
		private readonly OrderItemRepository _orderItemRepo;
		private readonly FoodRepository _foodRepo;
		public OrderServiceImpl(OrderRepository orderRepo, CartRepository cartRepo,
			CartItemRepository cartItemRepo, ApplicationDBContext context,
			ShopRepository shopRepo, IMapper mapper,
			OrderItemRepository orderItemRepo, FoodRepository foodRepo)
		{
			_orderRepo = orderRepo;
			_cartRepo = cartRepo;
			_cartItemRepo = cartItemRepo;
			_context = context;
			_shopRepo = shopRepo;
			_mapper = mapper;
			_orderItemRepo = orderItemRepo;
			_foodRepo = foodRepo;
		}

		public async Task<bool> CancelOrder(AppUser user, string orderId)
		{
			var order = await _orderRepo.GetOrdersByIdAsync(orderId);
			if (order == null) throw new EntityNotFoundException("Order not found");

			// check whether order is belong to user or not
			if (order.CustomerId != user.Id) throw new ForbiddenException("Order does not belong to user");

			if (order.PaymentStatus == PaymentStatus.Paid) return false;
			if (order.Status == OrderStatus.Canceled) throw new ArgumentException("Order is already canceled");

			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				// Increase the quantity of food items in the order
				foreach (var orderItem in order.OrderItems)
				{
					var food = await _foodRepo.GetFoodByIdAsync(orderItem.FoodId);
					if (food != null)
					{
						food.Quantity += orderItem.Quantity;
					}
				}

				order.Status = OrderStatus.Canceled;
				await _context.SaveChangesAsync();
				await transaction.CommitAsync();
				return true;
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		}

		public async Task CreateOrder(AppUser user, CreateOrderRequestDto request)
		{
			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				var cart = await _cartRepo.GetCartByUserAsync(user);
				if (cart == null) throw new EntityNotFoundException("Cart not found");

				// check cart items is exist in cart or not
				if (!await _cartItemRepo.IsCartItemValid(cart, request.CartItemIds))
					throw new ArgumentException("Invalid cart items");

				// get cart items in cart
				var cartItems = await _cartItemRepo.GetCartItemsOfUserAsync(cart, request.CartItemIds);

				// check any item has quantity larger than food quantity
				foreach (var item in cartItems)
				{
					if (item.Food.Quantity < item.Quantity)
					{
						throw new InsufficientStockException($"Not enough stock for {item.Food.Name}");
					}
					item.Food.Quantity -= item.Quantity;
				}

				// group cart items by shop id
				var groupedByShop = cartItems.GroupBy(ci => ci.Food.ShopId);

				var orders = new List<Order>();
				cart.Total -= cartItems.Sum(ci => ci.Quantity);
				foreach (var group in groupedByShop)
				{
					var shopId = group.Key;
					var orderItems = group.Select(ci => new OrderItem
					{
						FoodId = ci.FoodId,
						Quantity = ci.Quantity,
						Price = ci.Food.Price
					}).ToList();

					var totalNumber = orderItems.Sum(oi => oi.Quantity);
					var totalPrice = orderItems.Sum(oi => oi.Price);
					var shop = await _shopRepo.GetShopByIdAsync(shopId);

					// create order for each shop
					var order = new Order
					{
						TotalNumber = totalNumber,
						TotalPrice = totalPrice,
						Address = request.Address,
						CustomerId = user.Id,
						Customer = user,
						PaymentStatus = PaymentStatus.Pending,
						Status = OrderStatus.Processing,
						ShopId = shopId,
						Shop = shop,
						OrderItems = orderItems
					};

					await _orderRepo.CreateOrderAsync(order);
					orders.Add(order);
				}

				await _cartRepo.UpdateCartAsync(cart);
				await _cartItemRepo.RemoveCartItemsAsync(cart, cartItems);
				await transaction.CommitAsync();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				throw;
			}
		}

		public async Task<IEnumerable<OrderItemResponseDto>> GetOrderItemsOfOrder(string orderId)
		{
			var orderItems = await _orderItemRepo.GetOrderIemsByOrderIdAsync(orderId);
			var response = _mapper.Map<IEnumerable<OrderItemResponseDto>>(orderItems);
			return response;
		}

		public IQueryable<OrderResponseDto> GetOrdersByShop(AppUser user)
		{
			var shop = _shopRepo.GetShopByUser(user).Result;
			if (shop == null) throw new EntityNotFoundException("Shop not found");

			var orders = _orderRepo.GetOrdersByShop(shop.Id);
			var response = orders.ProjectTo<OrderResponseDto>(_mapper.ConfigurationProvider);
			return response;
		}

		public IQueryable<OrderResponseDto> GetOrdersByUser(AppUser user)
		{
			var orders = _orderRepo.GetOrdersByUser(user);
			var response = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
			return response.AsQueryable();
		}

		public async Task<bool> UpdateOrderPaymentStatus(string orderId, UpdateOrderPaymentStatusRequest request)
		{
			var order = await _orderRepo.GetOrdersByIdAsync(orderId);
			if (order == null) throw new EntityNotFoundException("Order not found"); 
			order.PaymentStatus = request.Status;
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> UpdateOrderStatus(AppUser user, string orderId, UpdateOrderStatusRequest request)
		{
			var order = await _orderRepo.GetOrdersByIdAsync(orderId);
			if (order == null) throw new EntityNotFoundException("Order not found");

			var shop = await _shopRepo.GetShopByUser(user);
			if (shop == null) throw new EntityNotFoundException("Shop not found");

			// check whether order is exist in shop or not
			var isOrderExistInShop = await _orderRepo.IsOrderExistInShop(orderId, shop.Id);
			if (!isOrderExistInShop) throw new ForbiddenException("Order not belong to this shop");

			if (order.PaymentStatus != PaymentStatus.Paid)
				throw new ArgumentException("Order status can only be updated if payment is completed");
			if (order.Status == OrderStatus.Delivered || order.Status == OrderStatus.Canceled)
				throw new ArgumentException("Can not update this order because it's already delivered or canceled");

			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				order.Status = request.Status;
				await _context.SaveChangesAsync();
				await transaction.CommitAsync();
				return true;
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		}
	}
}
