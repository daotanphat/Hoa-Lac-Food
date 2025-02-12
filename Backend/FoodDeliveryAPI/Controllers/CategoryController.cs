﻿using AutoMapper;
using BusinessObjects.Dtos;
using BusinessObjects.Dtos.Category.Request;
using BusinessObjects.Dtos.Category.Response;
using FoodDeliveryAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CategoryController : ControllerBase
	{
		private readonly ICategoryService _categoryService;
		private readonly IUserService _userService;
		private readonly IMapper _mapper;
		public CategoryController(ICategoryService categoryService, IUserService userService,
			IMapper mapper)
		{
			_categoryService = categoryService;
			_userService = userService;
			_mapper = mapper;
		}
		[Authorize(Roles = "Admin")]
		[HttpPost]
		public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequestDto request,
			[FromHeader(Name = "Authorization")] string header)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (string.IsNullOrEmpty(header) || !header.StartsWith("Bearer"))
				return Unauthorized("Invalid or missing authorization token!");
			var token = header["Bearer ".Length..].Trim();

			var user = await _userService.GetUserFromToken(token);

			var category = await _categoryService.CreateCategory(request, user);
			var categoryResponse = _mapper.Map<CategoryResponseDto>(category);
			var response = new ResponseApiDto<CategoryResponseDto>(
				"success",
				"Create Category successfully!",
				categoryResponse);

			return Ok(response);
		}
	}
}
