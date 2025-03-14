﻿using AutoMapper;
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

			return _mapper.Map<CartResponseDto>(cart);
		}

		public async Task<Cart> CreateCart(AppUser user)
		{
			return await _cartRepo.CreateCart(user);
		}

		public async Task<CartResponseDto> DecreaseItemInCart(AppUser user, int foodId, int quantity)
		{
			var cart = await _cartRepo.GetCartByUserAsync(user);
			if (cart == null) throw new EntityNotFoundException("Cart not found!");

			var food = await _foodRepo.GetFoodByIdAsync(foodId);
			if (food == null) throw new EntityNotFoundException("Food not found!");

			var isFoodExistInCart = await _cartItemRepo.GetByCartAndFoodAsync(cart.Id, foodId);
			if (isFoodExistInCart != null)
			{
				isFoodExistInCart.Quantity -= quantity;
				if (isFoodExistInCart.Quantity <= 0)
				{
					await _cartItemRepo.DeleteCartItemAsync(isFoodExistInCart);
					cart.CartItems.Remove(isFoodExistInCart);
				}
				else
				{
					await _cartItemRepo.UpdateCartItemAsync(isFoodExistInCart);
				}

				cart.Total -= quantity;
				if (cart.Total < 0) cart.Total = 0;
				await _cartRepo.UpdateCartAsync(cart);
			}
			else
			{
				throw new ArgumentException("Food is not exist in cart!");
			}

			return _mapper.Map<CartResponseDto>(cart); ;
		}

		public async Task<CartResponseDto> GetCartByUser(AppUser user)
		{
			var cart = await _cartRepo.GetCartByUserAsync(user);
			var cartResponse = _mapper.Map<CartResponseDto>(cart);
			return cartResponse;
		}

		public async Task<bool> RemoveCartItem(int cartItemId, AppUser user)
		{
			var cart = await _cartRepo.GetCartByUserAsync(user);
			if (cart.CartItems.Any(c => c.Id == cartItemId))
			{
				var cartItem = await _cartItemRepo.GetCartItemById(cartItemId);
				if (cartItem == null) throw new EntityNotFoundException("Not found this item!");
				await _cartItemRepo.DeleteCartItemAsync(cartItem);

				cart.Total -= cartItem.Quantity;
				await _cartRepo.UpdateCartAsync(cart);
			}
			else
			{
				return false;
			}
			return true;
		}
	}
}
