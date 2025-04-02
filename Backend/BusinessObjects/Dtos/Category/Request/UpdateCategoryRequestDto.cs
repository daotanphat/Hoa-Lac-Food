using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Category.Request
{
	public class UpdateCategoryRequestDto
	{
		[Required(ErrorMessage = "Category name cannot be empty.")]
		[StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
		[MinLength(3, ErrorMessage = "Category name must be at least 3 characters long.")]
		[RegularExpression(@"^[\p{L}0-9 ]*$", ErrorMessage = "Category Name cannot contain special characters.")]
		public string Name { get; set; } = string.Empty;
	}
}
