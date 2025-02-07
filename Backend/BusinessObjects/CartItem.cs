using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
	public class CartItem
	{
		public int Id { get; set; }

		public int CartId { get; set; }
		public Cart Cart { get; set; } = null!;

		public int FoodId { get; set; }
		public Food Food { get; set; } = null!;
		[Precision(18, 2)]
		public decimal Price { get; set; }
		public int Quantity { get; set; }
	}
}
