using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Food.Response
{
	public class FoodResponseDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public decimal Price { get; set; }
		public string Image { get; set; } = string.Empty;
		public int Quantity { get; set; }
		public bool Available { get; set; } = true;
		public DateTime CreateAt { get; set; } = DateTime.Now;
		public string CategoryName { get; set; } = string.Empty;
		public string ShopName { get; set; } = string.Empty;
	}
}
