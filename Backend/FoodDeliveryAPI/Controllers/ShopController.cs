﻿using AutoMapper;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Shop.Request;
using BusinessObjects.Dtos.Shop.Response;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
	}
}
