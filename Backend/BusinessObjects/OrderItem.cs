using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
	public class OrderItem
	{
		public int Id { get; set; }

		public int OrderId { get; set; }
		public Order Order { get; set; } = null!;

		public int FoodId { get; set; }
		public Food Food { get; set; } = null!;

		public int Quantity { get; set; }
		[Precision(18, 2)]
		public decimal Price { get; set; }
	}
}
