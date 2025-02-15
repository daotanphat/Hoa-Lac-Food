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

		public async Task<bool> IsFoodExist(string foodName, int shopId)
		{
			var foodByShop = await _context.Foods.Where(f => f.ShopId == shopId).ToListAsync();
			return foodByShop.Any(f => f.Name == foodName);
		}

		public async Task<Food> GetFoodByIdAsync(int id)
		{
			return await _context.Foods
				.Include(f => f.Category)
				.Include(f => f.Shop)
				.FirstOrDefaultAsync(f => f.Id == id);
		}

		public async Task<Food> UpdateFood(Food food)
		{
			try
			{
				_context.Foods.Update(food);
				await _context.SaveChangesAsync();

				return food;
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
		}
	}
}
