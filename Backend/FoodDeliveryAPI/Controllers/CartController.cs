using AutoMapper;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Cart.Request;
using BusinessObjects.Dtos.Cart.Response;
using FoodDeliveryAPI.Service;
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

		[HttpPut("add/food")]
		public async Task<IActionResult> AddFoodToCart([FromBody] AddFoodToCartRequestDto request,
			[FromHeader(Name = "Authorization")] string header)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (string.IsNullOrEmpty(header) || !header.StartsWith("Bearer "))
				return Unauthorized("Invalid or missing authorization token!");
			var token = header["Bearer ".Length..].Trim();

			var user = await _userService.GetUserFromToken(token);

			var cart = await _cartService.AddFoodToCart(user, request.FoodId, request.Quantity);
			var response = new ResponseApiDto<CartResponseDto>(
				"ok",
				"Add food to cart successfully",
				cart);
			return Ok(response);
		}
	}
}
