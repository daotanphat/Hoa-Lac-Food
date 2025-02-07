using Microsoft.AspNetCore.Identity;

namespace BusinessObjects
{
	public class AppUser : IdentityUser
	{
		public string FullName { get; set; } = string.Empty;
		public string Address { get; set; } = string.Empty;
		public string Image { get; set; } = string.Empty;
		public bool IsActive { get; set; } = true;
		public DateTime CreateAt { get; set; } = DateTime.Now;

		public int? ShopId { get; set; }
		public Shop? Shop { get; set; }

		public ICollection<Order> Orders { get; set; } = new List<Order>();
		public Cart? Cart { get; set; }
	}
}
