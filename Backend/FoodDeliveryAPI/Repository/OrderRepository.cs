using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class OrderRepository
	{
		private readonly ApplicationDBContext _context;
		public OrderRepository(ApplicationDBContext context)
		{

			_context = context;
		}

		public async Task<Order> CreateOrderAsync(Order order)
		{
			await _context.Orders.AddAsync(order);
			await _context.SaveChangesAsync();
			return order;
		}

		public IQueryable<Order> GetOrdersByUser(AppUser user)
		{
			return _context.Orders
				.Include(o => o.Customer)
				.Include(o => o.Shop)
				.Include(o => o.OrderItems)
				.ThenInclude(oi => oi.Food)
				.Where(o => o.CustomerId == user.Id)
				.OrderByDescending(o => o.CreateAt);
		}

		public IQueryable<Order> GetOrdersByShop(int shopId)
		{
			return _context.Orders
				.AsNoTracking()
				.Include(o => o.Customer)
				.Include(o => o.Shop)
				.Include(o => o.OrderItems)
					.ThenInclude(oi => oi.Food)
				.Where(o => o.ShopId == shopId)
				.OrderByDescending(o => o.CreateAt);
		}

		public async Task<Order> GetOrdersByIdAsync(string orderId)
		{
			return await _context.Orders
				.Include(o => o.Customer)
				.SingleOrDefaultAsync(o => o.OrderId == orderId);
		}

		public async Task<bool> IsOrderExistInShop(string orderId, int shopId)
		{
			return await _context.Orders
				.AnyAsync(o => o.OrderId == orderId && o.ShopId == shopId);
		}
	}
}
