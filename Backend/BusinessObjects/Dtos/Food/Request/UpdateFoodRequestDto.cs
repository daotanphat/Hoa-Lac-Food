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
	public class UpdateFoodRequestDto
	{
		[StringLength(100, ErrorMessage = "Food name cannot exceed 100 characters.")]
		[RegularExpression(@"^[\p{L}0-9 ]*$", ErrorMessage = "Food Name cannot contain special characters.")]
		public string? Name { get; set; }
		[Range(0.01, 999999.99, ErrorMessage = "Price must be between 0.01 and 999999.99.")]
		[Precision(18, 2)]
		public decimal? Price { get; set; }
		[DataType(DataType.Upload)]
		public IFormFile? Image { get; set; }
		[Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
		public int? Quantity { get; set; }
		[Range(1, int.MaxValue, ErrorMessage = "Invalid Category ID.")]
		public int? CategoryId { get; set; }
	}
}
