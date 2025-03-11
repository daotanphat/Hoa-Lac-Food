using BusinessObjects;
using BusinessObjects.Dtos.User.Response;

namespace FoodDeliveryAPI.Service
{
	public interface IUserService
	{
		Task<AppUser> GetUserFromToken(string token);
	}
}
