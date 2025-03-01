using BusinessObjects;

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
	}
}
