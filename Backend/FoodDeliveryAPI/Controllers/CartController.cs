using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Cart.Request;
using BusinessObjects.Dtos.Cart.Response;
using FoodDeliveryAPI.Helper;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CartController : ControllerBase
	{
		private readonly ICartService _cartService;
		private readonly IUserService _userService;
		public CartController(ICartService cartService, IUserService userService,
			IMapper mapper)
		{
			_cartService = cartService;
			_userService = userService;
		}

		[Authorize]
		[HttpGet]
		public async Task<IActionResult> GetCartByUser([FromHeader(Name = "Authorization")] string header)
		{
			var token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);
			var cart = await _cartService.GetCartByUser(user);
			var response = new ResponseApiDto<CartResponseDto>(
				"ok",
				"Get cart successfully",
				cart);
			return Ok(response);
		}

		[Authorize]
		[HttpPut("add/food")]
		public async Task<IActionResult> AddFoodToCart([FromBody] AddFoodToCartRequestDto request,
			[FromHeader(Name = "Authorization")] string header)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			var token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);

			var cart = await _cartService.AddFoodToCart(user, request.FoodId, request.Quantity);
			var response = new ResponseApiDto<CartResponseDto>(
				"ok",
				"Add food to cart successfully",
				cart);
			return Ok(response);
		}

		[Authorize]
		[HttpDelete("{id:int:min(1)}")]
		public async Task<IActionResult> RemoveCartItem([FromRoute] int id,
			[FromHeader(Name = "Authorization")] string header)
		{
			var token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);

			var status = await _cartService.RemoveCartItem(id, user);
			if (status == false)
				return BadRequest("You do not have permission to delete!");

			var response = new ResponseApiDto<object>(
				"ok",
				"Remove cart item successfully",
				null);
			return Ok(response);
		}

		[Authorize]
		[HttpPut]
		public async Task<IActionResult> DecreaseItemCartItem([FromBody] DecreaseNumItemRequestDto request,
			[FromHeader(Name = "Authorization")] string header)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			var token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);

			var cart = await _cartService.DecreaseItemInCart(user, request.FoodId, request.Quantity);

			var response = new ResponseApiDto<CartResponseDto>(
				"ok",
				"Remove cart item successfully",
				cart);
			return Ok(response);
		}
	}
}
