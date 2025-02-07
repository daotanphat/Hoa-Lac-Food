using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
	public class Food
	{
		public int Id { get; set; }
		public string Name { get; set; } = String.Empty;
		[Precision(18, 2)]
		public decimal Price { get; set; }
		public string Image { get; set; } = string.Empty;
		public int Quantity { get; set; }
		public bool Available { get; set; }
		public DateTime CreateAt { get; set; } = DateTime.Now;

		public int CategoryId { get; set; }
		public Category Category { get; set; } = null!;

		public int ShopId { get; set; }
		public Shop Shop { get; set; } = null!;
	}
}
