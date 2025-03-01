using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class CartItemRepository
	{
		private readonly ApplicationDBContext _context;
		public CartItemRepository(ApplicationDBContext context)
		{
			_context = context;
		}

		public async Task<CartItem> GetCartItemById(int cartItemId)
			=> await _context.CartItems.SingleOrDefaultAsync(c => c.Id == cartItemId);

		public async Task<CartItem> GetByCartAndFoodAsync(int cartId, int foodId)
		{
			return await _context.CartItems
				.SingleOrDefaultAsync(c => c.CartId == cartId && c.FoodId == foodId);
		}

		public async Task<CartItem> AddNewCartItemAsync(CartItem cartItem)
		{
			await _context.CartItems.AddAsync(cartItem);
			await _context.SaveChangesAsync();
			return cartItem;
		}

		public async Task<CartItem> UpdateCartItemAsync(CartItem cartItem)
		{
			_context.CartItems.Update(cartItem);
			await _context.SaveChangesAsync();
			return cartItem;
		}

		public async Task DeleteCartItemAsync(CartItem cartItem)
		{
			try
			{
				_context.CartItems.Remove(cartItem);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				throw new Exception($"Error deleteing cart item: {ex.Message}");
			}
		}

		public Task<bool> IsCartItemValid(Cart cart, List<int> cartItemIds)
		{
			var allItemsExist = cartItemIds.All(id => cart.CartItems.Any(ci => ci.Id == id && ci.CartId == cart.Id));
			return Task.FromResult(allItemsExist);
		}

		public async Task<List<CartItem>> GetCartItemsOfUserAsync(Cart cart, List<int> cartItemIds)
		{
			return await _context.CartItems
				.Where(ci => ci.CartId == cart.Id && cartItemIds.Contains(ci.Id))
				.Include(ci => ci.Food)
				.ToListAsync();
		}

		public async Task RemoveCartItemsAsync(Cart cart, List<CartItem> selectedCartItems)
		{
			_context.CartItems.RemoveRange(selectedCartItems);
			await _context.SaveChangesAsync();
		}
	}
}
