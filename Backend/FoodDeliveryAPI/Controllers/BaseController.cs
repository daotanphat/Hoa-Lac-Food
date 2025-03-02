using BusinessObjects;
using FoodDeliveryAPI.Helper;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
	[Authorize]
	public class BaseController : ControllerBase
	{
		private readonly IUserService _userService;
		public BaseController(IUserService userService)
		{
			_userService = userService;
		}
		protected async Task<AppUser> GetAuthenticatedUser(string header)
		{
			var token = TokenHelper.ExtractBearerToken(header);
			return await _userService.GetUserFromToken(token);
		}
	}
}
