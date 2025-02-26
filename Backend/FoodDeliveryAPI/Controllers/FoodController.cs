using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Food.Request;
using BusinessObjects.Dtos.Food.Response;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class FoodController : ControllerBase
	{
		private readonly IFoodService _foodService;
		private readonly IMapper _mapper;
		private readonly IUserService _userService;
		public FoodController(IFoodService foodService, IMapper mapper,
			IUserService userService)
		{
			_foodService = foodService;
			_mapper = mapper;
			_userService = userService;
		}

		[Authorize(Roles = "Shop")]
		[HttpPost]
		public async Task<IActionResult> CreateFood([FromForm] CreateFoodRequestDto request,
			[FromHeader(Name = "Authorization")] string header)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (string.IsNullOrEmpty(header) || !header.StartsWith("Bearer "))
				return Unauthorized("Invalid or missing authorization token!");
			var token = header["Bearer ".Length..].Trim();

			var user = await _userService.GetUserFromToken(token);

			var food = await _foodService.CreateFood(request, user.Shop);

			var foodResponse = _mapper.Map<FoodResponseDto>(food);
			var response = new ResponseApiDto<FoodResponseDto>(
				"success",
				"Create food successfully!",
				foodResponse);

			return Ok(response);
		}

		[Authorize(Roles = "Shop")]
		[HttpPut("{id}/update-status")]
		public async Task<IActionResult> UpdateFoodStatus([FromRoute] int id)
		{
			var food = await _foodService.UpdateFoodStatus(id);
			var foodResponse = _mapper.Map<FoodResponseDto>(food);
			var response = new ResponseApiDto<FoodResponseDto>(
				"success",
				"Update food status successfully!",
				foodResponse);

			return Ok(response);
		}

		[HttpGet("{id:int:min(1)}")]
		public async Task<IActionResult> GetFoodDetails([FromRoute] int id)
		{
			var food = await _foodService.GetFoodDetails(id);
			var foodResponse = _mapper.Map<FoodResponseDto>(food);
			var response = new ResponseApiDto<FoodResponseDto>("" +
				"success",
				"Get food detail successfully!",
				foodResponse);

			return Ok(response);
		}

		[EnableQuery]
		[HttpGet("/odata/Food/GetByShop(shopId={shopId:int:min(1)})")]
		public IActionResult GetFoodByShop([FromRoute] int shopId)
		{
			var foods = _foodService.GetAllFoodByShop(shopId);
			if (foods == null) return NotFound();
			var foodResponse = _mapper.Map<IEnumerable<FoodResponseDto>>(foods);
			return Ok(foodResponse);
		}

		[EnableQuery]
		[HttpGet("/odata/Food")]
		public IActionResult GetAllFood()
		{
			var foods = _foodService.GetAllFood();
			if (foods == null) return NotFound();
			var foodResponse = _mapper.Map<IEnumerable<FoodResponseDto>>(foods);
			return Ok(foodResponse);
		}
	}
}
