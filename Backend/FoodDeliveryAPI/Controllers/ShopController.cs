using AutoMapper;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Shop.Request;
using BusinessObjects.Dtos.Shop.Response;
using FoodDeliveryAPI.Helper;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ShopController : ControllerBase
	{
		private readonly IShopService _shopService;
		private readonly IUserService _userService;
		private readonly IMapper _mapper;
		public ShopController(IShopService shopService, IUserService userService,
			IMapper mapper)
		{
			_shopService = shopService;
			_userService = userService;
			_mapper = mapper;
		}

		[EnableQuery]
		[HttpGet("/odata/shop")]
		public async Task<IActionResult> GetShops()
		{
			var shops = _shopService.GetShopList();
			return Ok(shops);
		}

		[Authorize(Roles = "Shop")]
		[HttpPost]
		public async Task<IActionResult> CreateShop([FromForm] CreateShopRequestDto request,
			[FromHeader(Name = "Authorization")] string header)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
				return Unauthorized("Invalid or missing authorization token!");
			var token = header["Bearer ".Length..].Trim();

			var user = await _userService.GetUserFromToken(token);
			if (user == null) return Unauthorized("User not found or token is invalid!");

			var shopCreated = await _shopService.CreateShop(request, user, request.Photo);
			if (shopCreated == null) return BadRequest("Failed to create shop!");
			var shopResponse = _mapper.Map<CreateShopResponseDto>(shopCreated);

			var response = new ResponseApiDto<CreateShopResponseDto>("success", "Create shop successfully", shopResponse);

			return Ok(response);
		}

		[Authorize(Roles = "Shop")]
		[HttpPut("{shopName}/update-statement")]
		public async Task<IActionResult> UpdateShopStatement([FromRoute] string shopName)
		{
			if (shopName == null) return NotFound("Can not found shop!");

			var shop = await _shopService.UpdateShopStatement(shopName);
			if (shop == null) return NotFound("Can not found shop!");

			var shopResponse = _mapper.Map<ShopResponseDto>(shop);
			var response = new ResponseApiDto<ShopResponseDto>(
				"Success",
				"Update statement of shop successfully!",
				shopResponse);

			return Ok(response);
		}

		[Authorize(Roles = "Admin")]
		[HttpPut("{shopId:int:min(1)}/update-status")]
		public async Task<IActionResult> UpdateShopStatus([FromRoute] int shopId)
		{
			var shop = await _shopService.UpdateShopStatus(shopId);
			var response = new ResponseApiDto<ShopResponseDto>(
				"Success",
				"Update status of shop successfully!",
				shop);

			return Ok(response);
		}

		[Authorize(Roles = "Shop")]
		[HttpPut]
		public async Task<IActionResult> UpdateShop([FromForm] UpdateShopRequestDto request,
			[FromHeader(Name = "Authorization")] string header)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			var token = TokenHelper.ExtractBearerToken(header);
			var user = await _userService.GetUserFromToken(token);

			var shopUpdated = await _shopService.UpdateShop(user, request);
			var response = new ResponseApiDto<ShopResponseDto>(
				"success",
				"Update shop successfully",
				shopUpdated);

			return Ok(response);
		}
	}
}
