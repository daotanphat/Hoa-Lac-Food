using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Shop.Request
{
	public class UpdateShopRequestDto
	{
		[MinLength(3, ErrorMessage = "Shop Name must have at least 3 characters")]
		[RegularExpression(@"^[a-zA-Z0-9\s]+$", ErrorMessage = "Shop Name must not contain special characters")]
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		[MinLength(3, ErrorMessage = "Shop Address must have at least 3 characters")]
		public string Address { get; set; } = string.Empty;
		[RegularExpression(@"^\d+$", ErrorMessage = "Bank must contain only numbers")]
		public string Bank { get; set; } = string.Empty;
		public IFormFile? Photo { get; set; }
	}
}
