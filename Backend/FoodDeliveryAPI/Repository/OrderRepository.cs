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
				.Where(o => o.CustomerId == user.Id);
		}
	}
}
