﻿using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Category.Request;
using FoodDeliveryAPI.Exceptions;
using FoodDeliveryAPI.Repository;

namespace FoodDeliveryAPI.Service.Implement
{
	public class CategoryServiceImpl : ICategoryService
	{
		private readonly CategoryRepository _categoryRepo;
		private readonly IMapper _mapper;
		public CategoryServiceImpl(CategoryRepository categoryRepo, IMapper mapper)
		{
			_categoryRepo = categoryRepo;
			_mapper = mapper;
		}
		public async Task<Category> CreateCategory(CreateCategoryRequestDto request, AppUser user)
		{
			var isCategoryExist = await _categoryRepo.IsCategoryExist(request.Name);
			if (isCategoryExist) throw new ArgumentException("Category Name is already exist!");

			var category = _mapper.Map<Category>(request);
			category.CreatedBy = user.Id;
			category.CreatedUser = user;
			var categoryCreated = await _categoryRepo.CreateCategoryAsync(category);
			if (categoryCreated == null) throw new InvalidOperationException("Create category fail!");
			return categoryCreated;
		}

		public async Task<bool> DeleteCategory(int id)
		{
			var category = await _categoryRepo.GetCategoryByIdAsync(id)
				?? throw new EntityNotFoundException($"Category with {id} not found!");
			if (await _categoryRepo.IsCategoryHasFood(id)) return false;
			await _categoryRepo.DeleteCategoryAsync(category);
			return true;
		}

		public async Task<List<Category>> GetAllCategories()
		{
			return await _categoryRepo.GetAllCategoriesAsync();
		}

		public async Task<Category> UpdateCategory(int id, UpdateCategoryRequestDto request)
		{
			var category = await _categoryRepo.GetCategoryByIdAsync(id);
			if (category.Name == request.Name) return category;

			var isCategoryExist = await _categoryRepo.IsCategoryExist(request.Name);
			if (isCategoryExist) throw new ArgumentException("Category name already exist");

			category.Name = request.Name;
			var categoryUpdate = await _categoryRepo.UpdateCategoryAsync(category);
			return categoryUpdate;
		}
	}
}
