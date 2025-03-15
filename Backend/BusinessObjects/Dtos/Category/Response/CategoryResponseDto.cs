using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Category.Response
{
	public class CategoryResponseDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public DateTime CreateAt { get; set; }
		public string CreatedUser { get; set; }
	}
}
