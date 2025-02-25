using BusinessObjects;
using BusinessObjects.Dtos.Cart.Response;

namespace FoodDeliveryAPI.Service
{
	public interface ICartService
	{
		Task<Cart> CreateCart(AppUser user);
		Task<CartResponseDto> AddFoodToCart(AppUser user, int foodId, int quantity);
		Task<CartResponseDto> GetCartByUser(AppUser user);
		Task<bool> RemoveCartItem(int cartItemId, AppUser user);
	}
}
