using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Dtos.Auth.Response
{
	public class LoginResponseDTO
	{
		public string UserName { get; set; }
		public string Email { get; set; }
		public string Token { get; set; }
	}
}
