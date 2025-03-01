using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Order.Request
{
	public class CreateOrderRequestDto
	{
		public List<int> CartItemIds { get; set; } = new List<int>();
		[Required]
		public string Address { get; set; }
	}
}
