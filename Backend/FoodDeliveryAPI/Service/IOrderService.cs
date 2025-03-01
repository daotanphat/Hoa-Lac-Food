using BusinessObjects;
using BusinessObjects.Dtos.Order;

namespace FoodDeliveryAPI.Service
{
	public interface IOrderService
	{
		Task CreateOrder(AppUser user, CreateOrderRequestDto request);
	}
}
