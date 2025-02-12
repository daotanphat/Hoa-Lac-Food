using BusinessObjects;
using FoodDeliveryAPI.Exceptions;
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
			if (principal == null) throw new ForbiddenException("You are not have permission!");

			var email = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
			if (string.IsNullOrEmpty(email)) throw new InvalidOperationException("Not found email!");

			var user = await _userManager.FindByEmailAsync(email);
			if (user == null) throw new EntityNotFoundException("User not found");
			return user;
		}
	}
}
