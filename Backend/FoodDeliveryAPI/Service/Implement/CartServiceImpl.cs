using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Cart.Response;
using FoodDeliveryAPI.Exceptions;
using FoodDeliveryAPI.Repository;

namespace FoodDeliveryAPI.Service.Implement
{
	public class CartServiceImpl : ICartService
	{
		private readonly CartRepository _cartRepo;
		private readonly CartItemRepository _cartItemRepo;
		private readonly FoodRepository _foodRepo;
		private readonly IMapper _mapper;
		public CartServiceImpl(CartRepository cartRepo, CartItemRepository cartItemRepo,
			FoodRepository foodRepo, IMapper mapper)
		{
			_cartRepo = cartRepo;
			_cartItemRepo = cartItemRepo;
			_foodRepo = foodRepo;
			_mapper = mapper;
		}

		public async Task<CartResponseDto> AddFoodToCart(AppUser user, int foodId, int quantity)
		{
			var cart = await _cartRepo.GetCartByUserAsync(user);
			if (cart == null) throw new EntityNotFoundException("Cart not found!");

			var food = await _foodRepo.GetFoodByIdAsync(foodId);
			if (food == null) throw new EntityNotFoundException("Food not found!");

			cart.CustomerId = user.Id;
			cart.Customer = user;
			cart.Total += quantity;

			var isFoodExistInCart = await _cartItemRepo.GetByCartAndFoodAsync(cart.Id, foodId);
			var cartItem = new CartItem();
			if (isFoodExistInCart != null)
			{
				isFoodExistInCart.Quantity += quantity;
				await _cartItemRepo.UpdateCartItemAsync(isFoodExistInCart);
			}
			else
			{
				cartItem = new CartItem
				{
					CartId = cart.Id,
					Cart = cart,
					FoodId = food.Id,
					Food = food,
					Quantity = quantity,
					Price = food.Price
				};
				cart.CartItems.Add(cartItem);
			}

			await _cartRepo.UpdateCartAsync(cart);

			return _mapper.Map<CartResponseDto>(cart); ;
		}

		public async Task<Cart> CreateCart(AppUser user)
		{
			return await _cartRepo.CreateCart(user);
		}
	}
}
