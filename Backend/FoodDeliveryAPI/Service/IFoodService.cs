using BusinessObjects;
using BusinessObjects.Dtos.Food.Request;

namespace FoodDeliveryAPI.Service
{
	public interface IFoodService
	{
		Task<Food> CreateFood(CreateFoodRequestDto request, Shop shop);
	}
}
