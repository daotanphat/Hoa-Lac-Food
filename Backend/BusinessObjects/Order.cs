using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessObjects.Enums.OrderEnums;

namespace BusinessObjects
{
	public class Order
	{
		public int Id { get; set; }
		public string OrderId { get; set; }
		public int TotalNumber { get; set; }
		[Precision(18, 2)]
		public decimal TotalPrice { get; set; }
		public string Address { get; set; } = string.Empty;

		public string? CustomerId { get; set; }
		public AppUser? Customer { get; set; }

		public DateTime CreateAt { get; set; } = DateTime.Now;
		public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
		public OrderStatus Status { get; set; } = OrderStatus.Processing;

		public int ShopId { get; set; }
		public Shop Shop { get; set; } = null!;

		public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

		public Order()
		{
			OrderId = Guid.NewGuid().ToString();
		}
	}
}
