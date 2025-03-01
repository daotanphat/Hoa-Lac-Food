using BusinessObjects.Dtos.Food.Response;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Cart.Response
{
	public class CartItemResponseDto
	{
		public int Id { get; set; }
		public FoodResponseDto Food { get; set; }
		public decimal Price { get; set; }
		public int Quantity { get; set; }
	}
}
