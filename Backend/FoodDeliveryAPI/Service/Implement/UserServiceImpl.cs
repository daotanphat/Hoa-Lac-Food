using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.User.Response;
using FoodDeliveryAPI.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace FoodDeliveryAPI.Service.Implement
{
	public class UserServiceImpl : IUserService
	{
		private readonly ITokenService _tokenService;
		private readonly UserManager<AppUser> _userManager;
		private readonly IMapper _mapper;
		public UserServiceImpl(ITokenService tokenService, UserManager<AppUser> userManager,
			IMapper mapper)
		{
			_tokenService = tokenService;
			_userManager = userManager;
			_mapper = mapper;
		}

		public async Task<AppUser> GetUserFromToken(string token)
		{
			var principal = _tokenService.GetPrincipalFromToken(token);
			if (principal == null) throw new ForbiddenException("You are not have permission!");

			var email = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
			if (string.IsNullOrEmpty(email)) throw new UnauthorizedAccessException("Not found email in token!");

			var user = await _userManager.Users
				.Include(u => u.Shop)
				.FirstOrDefaultAsync(u => u.Email == email);
			if (user == null) throw new EntityNotFoundException("User not found");
			return user;
		}
	}
}
