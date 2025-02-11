using BusinessObjects;
using BusinessObjects.Dtos.Shop.Request;

namespace FoodDeliveryAPI.Service
{
	public interface IShopService
	{
		Task<Shop> CreateShop(CreateShopRequestDto request, AppUser user, IFormFile photo);
		Task<bool> IsShopNameUnique(string name);
	}
}
