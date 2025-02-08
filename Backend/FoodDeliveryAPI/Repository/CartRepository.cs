using BusinessObjects;

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
	}
}
