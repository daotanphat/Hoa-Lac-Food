using BusinessObjects;

namespace FoodDeliveryAPI.Service
{
	public interface ITokenService
	{
		string CreateToken(AppUser user);
	}
}
