using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Auth.Request;
using BusinessObjects.Dtos.Auth.Response;
using Microsoft.AspNetCore.Identity;

namespace FoodDeliveryAPI.Service.Implement
{
	public class AuthServiceImpl : IAuthService
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly ITokenService _tokenService;
		private readonly SignInManager<AppUser> _signInManager;
		public AuthServiceImpl(UserManager<AppUser> userManager, ITokenService tokenService,
			SignInManager<AppUser> signInManager)
		{
			_userManager = userManager;
			_tokenService = tokenService;
			_signInManager = signInManager;
		}
		public async Task<LoginResponseDTO> Login(LoginRequestDto request)
		{
			var user = await _userManager.FindByNameAsync(request.UserName);

			if (user == null) return null;

			var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

			if (!result.Succeeded) return null;

			var roles = await _userManager.GetRolesAsync(user);

			var loginResponse = new LoginResponseDTO
			{
				UserName = user.UserName,
				Email = user.Email,
				Roles = roles.ToList(),
				Token = _tokenService.CreateToken(user)
			};

			return loginResponse;
		}
	}
}
