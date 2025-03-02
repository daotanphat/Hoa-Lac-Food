using BusinessObjects;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Order.Request;
using BusinessObjects.Dtos.Order.Response;
using FoodDeliveryAPI.Helper;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

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

		[EnableQuery]
		[Authorize]
		[HttpGet("/odata/order/customer")]
		public async Task<IActionResult> GetOrdersByCustomer([FromHeader(Name = "Authorization")] string header)
		{
			var token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);

			var orders = _orderService.GetOrdersByUser(user);
			return Ok(orders);
		}

		[Authorize]
		[HttpGet("{orderId}/details")]
		public async Task<IActionResult> GetOrderItemsOfOrder([FromRoute] string orderId)
		{
			var orderItems = await _orderService.GetOrderItemsOfOrder(orderId);
			var response = new ResponseApiDto<IEnumerable<OrderItemResponseDto>>(
				"success",
				"Get order details successfully!",
				orderItems);
			return Ok(response);
		}
	}
}
