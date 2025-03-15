using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Shop.Response
{
	public class CreateShopResponseDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public string Address { get; set; } = string.Empty;
		public string Image { get; set; } = string.Empty;
		public string Bank { get; set; } = string.Empty;
		public bool IsOpen { get; set; }
		public DateTime CreateAt { get; set; }
		public bool Status { get; set; }
	}
}
