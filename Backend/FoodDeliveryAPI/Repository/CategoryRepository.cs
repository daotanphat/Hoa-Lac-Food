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
	}
}
