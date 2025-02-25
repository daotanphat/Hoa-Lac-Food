using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Cart.Response
{
	public class CartResponseDto
	{
		public string CustomerName { get; set; } = null!;
		public int Total { get; set; }
		public ICollection<CartItemResponseDto> CartItems { get; set; } = new List<CartItemResponseDto>();
	}
}
