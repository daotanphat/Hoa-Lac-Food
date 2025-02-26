using BusinessObjects;
using BusinessObjects.Dtos.Shop.Request;
using BusinessObjects.Dtos.Shop.Response;

namespace FoodDeliveryAPI.Service
{
	public interface IShopService
	{
		Task<Shop> CreateShop(CreateShopRequestDto request, AppUser user, IFormFile photo);
		Task<bool> IsShopNameUnique(string name);
		Task<Shop> UpdateShopStatement(string shopName);
		Task<ShopResponseDto> UpdateShop(AppUser user, UpdateShopRequestDto request);
	}
}
