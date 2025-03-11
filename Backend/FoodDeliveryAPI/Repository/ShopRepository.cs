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

		public IQueryable<Shop> GetShops()
		{
			return _context.Shops
				.Where(s => s.Status == true);
		}

		public async Task<Shop> GetShopByName(string name)
		{
			return await _context.Shops.FirstOrDefaultAsync(s => s.Name == name);
		}

		public async Task<Shop> GetShopByIdAsync(int shopId)
		{
			return await _context.Shops.FirstOrDefaultAsync(s => s.Id == shopId);
		}

		public async Task<Shop> UpdateShopAsync(Shop shop)
		{
			var entry = _context.Entry(shop);
			entry.Property(s => s.Name).IsModified = true;
			entry.Property(x => x.Description).IsModified = true;
			entry.Property(x => x.Address).IsModified = true;
			entry.Property(x => x.Bank).IsModified = true;
			entry.Property(x => x.Image).IsModified = true;
			entry.Property(x => x.IsOpen).IsModified = true;
			entry.Property(x => x.Status).IsModified = true;

			await _context.SaveChangesAsync();
			return shop;
		}

		public async Task<Shop> GetShopByUser(AppUser appUser)
		{
			return await _context.Users
				.Where(u => u.Id == appUser.Id)
				.Select(u => u.Shop)
				.SingleOrDefaultAsync();
		}

		public async Task<bool> ShopNameExist(string name)
		{
			return await _context.Shops
				.AnyAsync(s => s.Name == name);
		}
	}
}
