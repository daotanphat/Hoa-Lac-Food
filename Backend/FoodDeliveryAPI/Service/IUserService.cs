using BusinessObjects;

namespace FoodDeliveryAPI.Service
{
	public interface IUserService
	{
		Task<AppUser> GetUserFromToken(string token);
	}
}
