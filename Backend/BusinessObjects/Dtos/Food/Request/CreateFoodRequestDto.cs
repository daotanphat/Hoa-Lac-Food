using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Food.Request
{
	public class CreateFoodRequestDto
	{
		[Required(ErrorMessage = "Food name is required.")]
		[StringLength(100, ErrorMessage = "Food name cannot exceed 100 characters.")]
		[RegularExpression(@"^[a-zA-Z0-9 ]*$", ErrorMessage = "Food name must not contain special characters.")]
		public string Name { get; set; } = string.Empty;
		[Required(ErrorMessage = "Price is required.")]
		[Range(0.01, 999999.99, ErrorMessage = "Price must be between 0.01 and 999999.99.")]
		[Precision(18, 2)]
		public decimal Price { get; set; }
		[Required(ErrorMessage = "Image is required.")]
		[DataType(DataType.Upload)]
		public IFormFile Image { get; set; }
		[Required(ErrorMessage = "Quantity is required.")]
		[Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
		public int Quantity { get; set; }
		[Required(ErrorMessage = "Category ID is required.")]
		[Range(1, int.MaxValue, ErrorMessage = "Invalid Category ID.")]
		public int CategoryId { get; set; }
	}
}
