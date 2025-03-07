﻿using BusinessObjects;
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
	public class OrderController : BaseController
	{
		private readonly IUserService _userService;
		private readonly IOrderService _orderService;
		public OrderController(IUserService userService, IOrderService orderService) : base(userService)
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

		[EnableQuery]
		[Authorize(Roles = "Shop")]
		[HttpGet("/odata/order/shop")]
		public async Task<IActionResult> GetOrdersByShop([FromHeader(Name = "Authorization")] string header)
		{
			var user = await GetAuthenticatedUser(header);
			var orders = _orderService.GetOrdersByShop(user);
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

		[Authorize(Roles = "Shop")]
		[HttpPut("{orderId}/update-status")]
		public async Task<IActionResult> UpdateOrderStatus([FromRoute] string orderId,
			[FromBody] UpdateOrderStatusRequest request,
			[FromHeader(Name = "Authorization")] string header)
		{
			var user = await GetAuthenticatedUser(header);
			var status = await _orderService.UpdateOrderStatus(user, orderId, request);
			if (status)
			{
				return Ok(new ResponseApiDto<object>(
					"success",
					"Update order status successfully!",
					null));
			}
			else
			{
				return BadRequest(new ResponseApiDto<string>(
					"fail",
					"Update order status failed!",
					"Order status can only be updated if payment is completed and order status is not delivered or canceled"));
			}
		}

		[Authorize]
		[HttpPut("{orderId}/cancel")]
		public async Task<IActionResult> CancelOrder([FromRoute] string orderId,
			[FromHeader(Name = "Authorization")] string header)
		{
			var user = await GetAuthenticatedUser(header);
			var status = await _orderService.CancelOrder(user, orderId);
			if (status)
			{
				return Ok(new ResponseApiDto<object>(
					"success",
					"Cancel order successfully!",
					null));
			}
			else
			{
				return BadRequest(new ResponseApiDto<string>(
					"fail",
					"Cancel order failed!",
					"Order can only be cancel if payment is not paid."));
			}
		}
	}
}
