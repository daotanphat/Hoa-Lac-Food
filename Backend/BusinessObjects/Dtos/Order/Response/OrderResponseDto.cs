using BusinessObjects.Dtos.Order.Request;
using BusinessObjects.Dtos.User.Response;
using BusinessObjects.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessObjects.Enums.OrderEnums;

namespace BusinessObjects.Dtos.Order.Response
{
	public class OrderResponseDto
	{
		public int Id { get; set; }
		public string OrderId { get; set; }
		public int TotalNumber { get; set; }
		public decimal TotalPrice { get; set; }
		public string Address { get; set; }

		public UserResponseDto Customer { get; set; } = null!;

		public DateTime CreateAt { get; set; }
		public PaymentStatus PaymentStatus { get; set; }
		public OrderStatus Status { get; set; }
		public string ShopName { get; set; }
		public ICollection<OrderItemResponseDto> OrderItems { get; set; } = new List<OrderItemResponseDto>();
	}
}
