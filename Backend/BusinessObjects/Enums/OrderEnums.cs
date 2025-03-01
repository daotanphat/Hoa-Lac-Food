using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Enums
{
	public static class OrderEnums
	{
		public enum PaymentStatus
		{
			Pending,
			Paid,
			Failed
		}

		public enum OrderStatus
		{
			Processing,
			Confirmed,
			Shipped,
			Delivered,
			Canceled
		}
	}
}
