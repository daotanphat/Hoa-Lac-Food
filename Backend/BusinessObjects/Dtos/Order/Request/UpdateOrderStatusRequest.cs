using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessObjects.Enums.OrderEnums;

namespace BusinessObjects.Dtos.Order.Request
{
	public class UpdateOrderStatusRequest
	{
		[Required]
		public OrderStatus Status { get; set; }
	}
}
