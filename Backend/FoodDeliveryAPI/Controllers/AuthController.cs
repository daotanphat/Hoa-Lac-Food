using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Auth.Request;
using BusinessObjects.Dtos.Auth.Response;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly ITokenService _tokenService;
		private readonly IMapper _mapper;

		public AuthController(UserManager<AppUser> userManager, ITokenService tokenService,
			IMapper mapper)
		{
			_userManager = userManager;
			_tokenService = tokenService;
			_mapper = mapper;
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
	}
}
