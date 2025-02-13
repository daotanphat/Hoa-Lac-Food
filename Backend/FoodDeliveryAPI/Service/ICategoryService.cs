using BusinessObjects;
using BusinessObjects.Dtos.Category.Request;

namespace FoodDeliveryAPI.Service
{
	public interface ICategoryService
	{
		Task<Category> CreateCategory(CreateCategoryRequestDto request, AppUser user);
		Task<List<Category>> GetAllCategories();
	}
}
