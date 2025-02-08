using BusinessObjects;

namespace FoodDeliveryAPI.Service
{
	public interface ICartService
	{
		Task<Cart> CreateCart(AppUser user);
	}
}
