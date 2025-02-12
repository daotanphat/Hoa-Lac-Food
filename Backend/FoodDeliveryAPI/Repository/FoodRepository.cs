using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class FoodRepository
	{
		private readonly ApplicationDBContext _context;
		public FoodRepository(ApplicationDBContext context)
		{
			_context = context;
		}

		public async Task<Food> CreateFoodAsync(Food food)
		{
			await _context.Foods.AddAsync(food);
			await _context.SaveChangesAsync();
			return food;
		}

		public async Task<bool> IsFoodExist(string foodName)
		{
			return await _context.Foods.AnyAsync(f => f.Name == foodName);
		}
	}
}
