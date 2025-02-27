using BusinessObjects;
using BusinessObjects.Dtos.Food.Request;
using BusinessObjects.Dtos.Food.Response;

namespace FoodDeliveryAPI.Service
{
	public interface IFoodService
	{
		Task<Food> CreateFood(CreateFoodRequestDto request, Shop shop);
		Task<Food> UpdateFoodStatus(int id);
		Task<Food> GetFoodDetails(int id);
		IQueryable<Food> GetAllFoodByShop(int shopId);
		IQueryable<Food> GetAllFood();
		Task<FoodResponseDto> UpdateFood(int id, UpdateFoodRequestDto request, AppUser user);
	}
}
