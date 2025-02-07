using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
	public class Shop
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public string Address { get; set; } = string.Empty;
		public string Image { get; set; } = string.Empty;
		public string Bank { get; set; } = string.Empty;
		public bool IsOpen { get; set; } = true;
		public DateTime CreateAt { get; set; } = DateTime.Now;
		public bool Status { get; set; } = true;

		public ICollection<Food> Foods { get; set; } = new List<Food>();
		public ICollection<Order> Orders { get; set; } = new List<Order>();
		public ICollection<AppUser> Users { get; set; } = new List<AppUser>();
	}
}
