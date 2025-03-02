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
	}
}
