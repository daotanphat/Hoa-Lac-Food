using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Category.Request
{
	public class CreateCategoryRequestDto
	{
		[Required(ErrorMessage = "Category Name is required.")]
		[StringLength(100, ErrorMessage = "Category Name cannot exceed 100 characters.")]
		[MinLength(3, ErrorMessage = "Category Name cannot shorter than 3 characters.")]
		[RegularExpression(@"^[\p{L}0-9 ]*$", ErrorMessage = "Category Name cannot contain special characters.")]
		public string Name { get; set; } = string.Empty;
	}
}
