using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Category.Request;
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
	}
}
