using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
	public class Cart
	{
		public int Id { get; set; }

		public string CustomerId { get; set; }
		public AppUser Customer { get; set; } = null!;
		public int Total { get; set; }

		public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
	}
}
