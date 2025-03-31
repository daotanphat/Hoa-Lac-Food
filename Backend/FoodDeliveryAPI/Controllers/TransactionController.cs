using BusinessObjects;
using BusinessObjects.Dtos.Order.Request;
using BusinessObjects.Dtos.Transaction;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;
using static BusinessObjects.Enums.OrderEnums;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TransactionController : ControllerBase
	{
		private readonly ApplicationDBContext _context;
		private readonly IConfiguration _configuration;
		private readonly ILogger<TransactionController> _logger;
		private readonly IOrderService _orderService;

		public TransactionController(ApplicationDBContext context, IConfiguration configuration,
			ILogger<TransactionController> logger, IOrderService orderService)
		{
			_context = context;
			_configuration = configuration;
			_logger = logger;
			_orderService = orderService;
		}

		[HttpPost("webhook/update-payment-status")]
		public async Task<IActionResult> UpdateOrderWebhook()
		{
			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				using StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8);
				string requestBody = await reader.ReadToEndAsync();

				_logger.LogInformation($"Received webhook data: {requestBody}");

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				};

				var transactionRequest = JsonSerializer.Deserialize<SepayTransactionRequest>(requestBody, options);

				if (transactionRequest == null)
				{
					_logger.LogWarning("Invalid webhook data received from Sepay.");
					return BadRequest(new { success = false, message = "Invalid data" });
				}

				string transactionContent = transactionRequest.Content?.Trim();
				if (transactionContent != null && transactionContent.StartsWith("DH"))
				{
					string orderIdWithoutHyphens = transactionContent.Substring("DH".Length);

					var order = await _context.Orders
						.Where(o => o.OrderId.Replace("-", "") == orderIdWithoutHyphens)
						.FirstOrDefaultAsync();

					if (order != null)
					{
						UpdateOrderPaymentStatusRequest request = new UpdateOrderPaymentStatusRequest
						{
							Status = PaymentStatus.Paid
						};
						await _orderService.UpdateOrderPaymentStatus(order.OrderId, request);

						decimal amountIn = transactionRequest.TransferType == "in" ? transactionRequest.TransferAmount : 0;
						decimal amountOut = transactionRequest.TransferType == "out" ? transactionRequest.TransferAmount : 0;

						var transactionEntity = new Transaction
						{
							Gateway = transactionRequest.Gateway,
							TransactionDate = DateTime.Parse(transactionRequest.TransactionDate),
							AccountNumber = transactionRequest.AccountNumber,
							SubAccount = transactionRequest.SubAccount,
							AmountIn = amountIn,
							AmountOut = amountOut,
							Accumulated = transactionRequest.Accumulated,
							Code = transactionRequest.Code,
							TransactionContent = transactionRequest.Content,
							ReferenceNumber = transactionRequest.ReferenceCode,
							Body = transactionRequest.Description
						};

						_context.Transactions.Add(transactionEntity);
						await _context.SaveChangesAsync();
						await transaction.CommitAsync();
						return Ok(new { success = true });
					}
					else
					{
						_logger.LogWarning($"No matching order found for payment reference: {orderIdWithoutHyphens}");
						return BadRequest(new { success = false, message = "No data" });
					}
				}
				return BadRequest(new { success = false, message = "Invalid transaction content" });
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error processing Sepay webhook");
				await transaction.RollbackAsync();
				return StatusCode(500, new { success = false, message = "Internal server error" });
			}
		}
	}
}