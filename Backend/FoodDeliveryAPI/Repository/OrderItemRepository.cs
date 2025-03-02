using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class OrderItemRepository
	{
		private readonly ApplicationDBContext _context;
		public OrderItemRepository(ApplicationDBContext context)
		{

			_context = context;
		}

		public async Task<IEnumerable<OrderItem>> GetOrderIemsByOrderIdAsync(string orderId)
		{
			return await _context.OrderItems
				.Include(oi => oi.Order)
				.Include(oi => oi.Food)
					.ThenInclude(f => f.Category)
				.Include(oi => oi.Food)
					.ThenInclude(f => f.Shop)
				.Where(oi => oi.Order.OrderId == orderId)
				.ToListAsync();
		}
	}
}
