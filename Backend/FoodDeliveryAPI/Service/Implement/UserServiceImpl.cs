using BusinessObjects;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace FoodDeliveryAPI.Service.Implement
{
	public class UserServiceImpl : IUserService
	{
		private readonly ITokenService _tokenService;
		private readonly UserManager<AppUser> _userManager;
		public UserServiceImpl(ITokenService tokenService, UserManager<AppUser> userManager)
		{
			_tokenService = tokenService;
			_userManager = userManager;
		}
		public async Task<AppUser> GetUserFromToken(string token)
		{
			var principal = _tokenService.GetPrincipalFromToken(token);
			if (principal == null) return null;

			var email = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
			if (string.IsNullOrEmpty(email)) return null;

			return await _userManager.FindByEmailAsync(email);
		}
	}
}
