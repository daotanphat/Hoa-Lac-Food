using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
	public class Category
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public DateTime CreateAt { get; set; } = DateTime.Now;

		public int CreatedBy { get; set; }
		public AppUser CreatedUser { get; set; } = null!;

		public ICollection<Food> Foods { get; set; } = new List<Food>();
	}
}
