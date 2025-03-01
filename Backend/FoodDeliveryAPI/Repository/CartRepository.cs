using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class CartRepository
	{
		private readonly ApplicationDBContext _context;
		public CartRepository(ApplicationDBContext context)
		{
			_context = context;
		}

		public async Task<Cart> CreateCart(AppUser user)
		{
			var cart = new Cart
			{
				CustomerId = user.Id,
				Customer = user,
				Total = 0,
			};

			await _context.Carts.AddAsync(cart);
			await _context.SaveChangesAsync();
			return cart;
		}

		public async Task<Cart> GetCartByUserAsync(AppUser user)
		{
			return await _context.Users
				.Where(u => u.Id == user.Id)
				.Include(u => u.Cart.CartItems)
					.ThenInclude(ci => ci.Food)
						.ThenInclude(f => f.Category)
				.Include(u => u.Cart.CartItems)
				.ThenInclude(ci => ci.Food)
						.ThenInclude(f => f.Shop)
				.Select(u => u.Cart)
				.SingleOrDefaultAsync();
		}

		public async Task UpdateCartAsync(Cart cart)
		{
			_context.Carts.Update(cart);
			await _context.SaveChangesAsync();
		}
	}
}
