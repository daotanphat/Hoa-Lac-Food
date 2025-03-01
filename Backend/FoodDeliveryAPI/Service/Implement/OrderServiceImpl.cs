using BusinessObjects;
using BusinessObjects.Dtos.Order;
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
		public OrderServiceImpl(OrderRepository orderRepo, CartRepository cartRepo,
			CartItemRepository cartItemRepo, ApplicationDBContext context,
			ShopRepository shopRepo)
		{
			_orderRepo = orderRepo;
			_cartRepo = cartRepo;
			_cartItemRepo = cartItemRepo;
			_context = context;
			_shopRepo = shopRepo;
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
	}
}
