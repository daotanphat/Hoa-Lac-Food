using BusinessObjects;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Order;
using FoodDeliveryAPI.Helper;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class OrderController : ControllerBase
	{
		private readonly IUserService _userService;
		private readonly IOrderService _orderService;
		public OrderController(IUserService userService, IOrderService orderService)
		{
			_userService = userService;
			_orderService = orderService;
		}

		[Authorize]
		[HttpPost]
		public async Task<IActionResult> CreateOrder([FromHeader(Name = "Authorization")] string header,
			[FromBody] CreateOrderRequestDto request)
		{
			var token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);

			await _orderService.CreateOrder(user, request);
			return Ok(new ResponseApiDto<object>("success", "Create order successfully!", null));
		}
	}
}
