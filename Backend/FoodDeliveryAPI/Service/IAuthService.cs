using BusinessObjects;
using BusinessObjects.Dtos.Auth.Request;
using BusinessObjects.Dtos.Auth.Response;

namespace FoodDeliveryAPI.Service
{
	public interface IAuthService
	{
		Task<LoginResponseDTO> Login(LoginRequestDto request);
	}
}
