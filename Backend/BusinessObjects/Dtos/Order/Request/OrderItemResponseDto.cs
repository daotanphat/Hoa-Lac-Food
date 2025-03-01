using BusinessObjects.Dtos.Food.Response;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Order.Request
{
	public class OrderItemResponseDto
	{
		public int Id { get; set; }
		public int OrderId { get; set; }
		public FoodResponseDto Food { get; set; } = null!;
		public int Quantity { get; set; }
		public decimal Price { get; set; }
	}
}
