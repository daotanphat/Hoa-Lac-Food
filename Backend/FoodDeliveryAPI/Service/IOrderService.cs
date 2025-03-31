using BusinessObjects;
using BusinessObjects.Dtos.Order.Request;
using BusinessObjects.Dtos.Order.Response;

namespace FoodDeliveryAPI.Service
{
	public interface IOrderService
	{
		Task CreateOrder(AppUser user, CreateOrderRequestDto request);
		IQueryable<OrderResponseDto> GetOrdersByUser(AppUser user);
		IQueryable<OrderResponseDto> GetOrdersByShop(AppUser user);
		Task<IEnumerable<OrderItemResponseDto>> GetOrderItemsOfOrder(string orderId);
		Task<bool> UpdateOrderStatus(AppUser user, string orderId, UpdateOrderStatusRequest request);
		Task<bool> UpdateOrderPaymentStatus(string orderId, UpdateOrderPaymentStatusRequest request);
		Task<bool> CancelOrder(AppUser user, string orderId);
	}
}
