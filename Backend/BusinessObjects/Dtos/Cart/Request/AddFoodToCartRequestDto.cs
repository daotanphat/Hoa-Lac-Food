using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Cart.Request
{
	public class AddFoodToCartRequestDto
	{
		[Required(ErrorMessage = "FoodId is required.")]
		[Range(1, int.MaxValue, ErrorMessage = "FoodId must be greater than 0.")]
		public int FoodId { get; set; }
		[Required(ErrorMessage = "Quantity is required.")]
		[Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
		public int Quantity { get; set; }
	}
}
