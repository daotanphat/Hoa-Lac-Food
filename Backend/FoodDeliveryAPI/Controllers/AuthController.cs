using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Auth.Request;
using BusinessObjects.Dtos.Auth.Response;
using BusinessObjects.Dtos.User.Response;
using FoodDeliveryAPI.Helper;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;
		private readonly IMapper _mapper;
		private readonly IAuthService _authService;
		private readonly ICartService _cartService;
		private readonly IUserService _userService;

		public AuthController(UserManager<AppUser> userManager, IMapper mapper,
			IAuthService authService, ICartService cartService,
			RoleManager<IdentityRole> roleManager, IUserService userService)
		{
			_userManager = userManager;
			_mapper = mapper;
			_authService = authService;
			_cartService = cartService;
			_roleManager = roleManager;
			_userService = userService;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
		{
			try
			{
				if (!ModelState.IsValid) return BadRequest(ModelState);

				var roleExists = await _roleManager.RoleExistsAsync(request.Role);
				if (!roleExists)
				{
					return BadRequest(new ResponseApiDto<object>(
						"fail",
						"Role does not exist!",
						null)
					);
				}

				var appUser = new AppUser
				{
					Email = request.Email,
					UserName = request.UserName
				};

				var createdUser = await _userManager.CreateAsync(appUser, request.Password);

				if (createdUser.Succeeded)
				{
					var roleResult = await _userManager.AddToRoleAsync(appUser, request.Role);
					if (roleResult.Succeeded)
					{
						await _cartService.CreateCart(appUser);
						var userResponse = _mapper.Map<RegisterResponseDto>(appUser);
						ResponseApiDto<RegisterResponseDto> response
							= new ResponseApiDto<RegisterResponseDto>("Success", "Register Successfully!", userResponse);
						return Ok(response);
					}
					else
					{
						return StatusCode(500, roleResult.Errors);
					}
				}
				else
				{
					return StatusCode(500, createdUser.Errors);
				}
			}
			catch (Exception e)
			{
				return StatusCode(500, e.Message);
			}
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
		{
			var result = await _authService.Login(request);

			if (result == null) return Unauthorized("Username or password is incorrect!");

			var response = new ResponseApiDto<LoginResponseDTO>("succes", "Login successfully", result);

			return Ok(response);
		}

		[Authorize]
		[HttpGet("info")]
		public async Task<IActionResult> GetUserByUsername([FromHeader(Name = "Authorization")] string header)
		{
			string token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);
			var userInfo = _mapper.Map<UserResponseDto>(user);
			var response = new ResponseApiDto<UserResponseDto>(
				"succes",
				"Get user info successfully",
				userInfo);
			return Ok(response);
		}
	}
}
