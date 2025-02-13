using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class CategoryRepository
	{
		private readonly ApplicationDBContext _context;
		public CategoryRepository(ApplicationDBContext context)
		{
			_context = context;
		}

		public async Task<bool> IsCategoryExist(int categoryId)
		{
			return await _context.Categories.AnyAsync(c => c.Id == categoryId);
		}

		public async Task<bool> IsCategoryExist(string categoryName)
		{
			return await _context.Categories.AnyAsync(c => c.Name == categoryName);
		}

		public async Task<Category> CreateCategoryAsync(Category category)
		{
			try
			{
				await _context.Categories.AddAsync(category);
				await _context.SaveChangesAsync();
				return category;
			}
			catch (Exception ex)
			{
				throw new InvalidOperationException(ex.Message);
			}
		}

		public async Task<List<Category>> GetAllCategoriesAsync()
		{
			return await _context.Categories
				.Include(c => c.CreatedUser)
				.ToListAsync();
		}
	}
}
