using BusinessObjects;
using FoodDeliveryAPI.Repository;

namespace FoodDeliveryAPI.Service.Implement
{
	public class CartServiceImpl : ICartService
	{
		private readonly CartRepository _cartRepo;
		public CartServiceImpl(CartRepository cartRepo)
		{
			_cartRepo = cartRepo;
		}
		public async Task<Cart> CreateCart(AppUser user)
		{
			return await _cartRepo.CreateCart(user);
		}
	}
}
