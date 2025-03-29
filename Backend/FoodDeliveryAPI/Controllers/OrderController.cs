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
using OfficeOpenXml;

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

		[EnableQuery]
		[Authorize(Roles = "Shop")]
		[HttpGet("/odata/order/shop/export-excel")]
		public async Task<IActionResult> ExportOrderToExcel([FromHeader(Name = "Authorization")] string header, ODataQueryOptions<OrderResponseDto> queryOptions)
		{
			var user = await GetAuthenticatedUser(header);
			var orders = _orderService.GetOrdersByShop(user);

			var filteredOrders = (IQueryable<OrderResponseDto>)queryOptions.ApplyTo(orders);

			ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

			using var package = new ExcelPackage();
			var workSheet = package.Workbook.Worksheets.Add($"Orders");

			workSheet.Cells[1, 1].Value = "ID";
			workSheet.Cells[1, 2].Value = "Customer Email";
			workSheet.Cells[1, 3].Value = "Total Price";
			workSheet.Cells[1, 4].Value = "Status";
			workSheet.Cells[1, 5].Value = "Payment Status";
			workSheet.Cells[1, 6].Value = "Date";

			var orderList = filteredOrders.ToList();
			for (int i = 0; i < orderList.Count; i++)
			{
				var order = orderList[i];
				workSheet.Cells[i + 2, 1].Value = order.Id;
				workSheet.Cells[i + 2, 2].Value = order.Customer.Email;
				workSheet.Cells[i + 2, 3].Value = order.TotalPrice;
				workSheet.Cells[i + 2, 4].Value = order.Status.ToString();
				workSheet.Cells[i + 2, 5].Value = order.PaymentStatus.ToString();
				workSheet.Cells[i + 2, 6].Value = order.CreateAt.ToString("yyyy-MM-dd HH:mm:ss");
			}

			var stream = new MemoryStream();
			await package.SaveAsAsync(stream);
			stream.Position = 0;
			return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report.xlsx");
		}
	}
}
