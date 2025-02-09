using BusinessObjects;
using System.Security.Claims;

namespace FoodDeliveryAPI.Service
{
	public interface ITokenService
	{
		string CreateToken(AppUser user);
		ClaimsPrincipal GetPrincipalFromToken(string token);
	}
}
