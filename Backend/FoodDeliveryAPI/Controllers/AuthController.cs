using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Auth.Request;
using BusinessObjects.Dtos.Auth.Response;
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
		private readonly IMapper _mapper;
		private readonly IAuthService _authService;
		private readonly ICartService _cartService;

		public AuthController(UserManager<AppUser> userManager, IMapper mapper,
			IAuthService authService, ICartService cartService)
		{
			_userManager = userManager;
			_mapper = mapper;
			_authService = authService;
			_cartService = cartService;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
		{
			try
			{
				if (!ModelState.IsValid) return BadRequest(ModelState);

				var appUser = new AppUser
				{
					Email = request.Email,
					UserName = request.UserName
				};

				var createdUser = await _userManager.CreateAsync(appUser, request.Password);

				if (createdUser.Succeeded)
				{
					var roleResult = await _userManager.AddToRoleAsync(appUser, "Customer");
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

		[Authorize(Roles = "Customer")]
		[HttpGet("test")]
		public async Task<IActionResult> test()
		{
			return Ok();
		}
	}
}
