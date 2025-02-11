using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class ShopRepository
	{
		private readonly ApplicationDBContext _context;
		public ShopRepository(ApplicationDBContext context)
		{
			_context = context;
		}

		public async Task<Shop> GetShopByName(string name)
		{
			return await _context.Shops.FirstOrDefaultAsync(s => s.Name == name);
		}
	}
}
