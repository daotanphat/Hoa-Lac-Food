using Microsoft.AspNetCore.Identity;

namespace BusinessObjects
{
	public class AppUser : IdentityUser
	{
		public string FullName { get; set; } = string.Empty;
		public string Address { get; set; } = string.Empty;
		public string Image { get; set; } = string.Empty;
		public bool IsActive { get; set; } = false;
		public DateTime CreateAt { get; set; } = DateTime.Now;
	}
}
