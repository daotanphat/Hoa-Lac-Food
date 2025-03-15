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
			return foodByShop.Any(f => f.Name.ToLower().Trim() == foodName.ToLower().Trim());
		}

		public async Task<Food> GetFoodByIdAsync(int id)
		{
			return await _context.Foods
				.Include(f => f.Category)
				.Include(f => f.Shop)
				.SingleOrDefaultAsync(f => f.Id == id);
		}

		public async Task<Food> UpdateFoodAsync(Food food)
		{
			try
			{
				var entry = _context.Entry(food);
				entry.Property(f => f.Name).IsModified = true;
				entry.Property(f => f.Price).IsModified = true;
				entry.Property(f => f.Image).IsModified = true;
				entry.Property(f => f.Quantity).IsModified = true;
				entry.Property(f => f.CategoryId).IsModified = true;
				entry.Property(f => f.Available).IsModified = true;

				await _context.SaveChangesAsync();
				return food;
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
		}

		public IQueryable<Food> GetAllFoodByShopAsync(int shopId)
		{
			return _context.Foods
				.Include(f => f.Category)
				.Include(f => f.Shop)
				.Where(f => f.ShopId == shopId)
				.OrderByDescending(f => f.CreateAt);
		}

		public IQueryable<Food> GetAllFoodAsync()
		{
			return _context.Foods
				.Include(f => f.Category)
				.Include(f => f.Shop);
		}
	}
}
