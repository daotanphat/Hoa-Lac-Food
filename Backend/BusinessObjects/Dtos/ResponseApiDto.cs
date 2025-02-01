using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos
{
	public class ResponseApiDto<T>
	{
		public string Status { get; set; }
		public string Message { get; set; }
		public T Data { get; set; }

		public ResponseApiDto(string status, string message, T data)
		{
			Status = status;
			Message = message;
			Data = data;
		}
	}
}
