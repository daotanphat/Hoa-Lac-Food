using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Food.Request;
using FoodDeliveryAPI.Exceptions;
using FoodDeliveryAPI.Repository;

namespace FoodDeliveryAPI.Service.Implement
{
	public class FoodServiceImpl : IFoodService
	{
		private readonly IMapper _mapper;
		private readonly ShopRepository _shopRepo;
		private readonly FoodRepository _foodRepo;
		private readonly CategoryRepository _categoryRepo;
		private readonly ICloudinaryService _cloudinaryService;
		private readonly ApplicationDBContext _context;
		public FoodServiceImpl(IMapper mapper, ShopRepository shopRepo,
			FoodRepository foodRepository, CategoryRepository categoryRepository,
			ICloudinaryService cloudinaryService, ApplicationDBContext context)
		{
			_mapper = mapper;
			_shopRepo = shopRepo;
			_foodRepo = foodRepository;
			_categoryRepo = categoryRepository;
			_cloudinaryService = cloudinaryService;
			_context = context;
		}
		public async Task<Food> CreateFood(CreateFoodRequestDto request, Shop shop)
		{
			var foodExist = await _foodRepo.IsFoodExist(request.Name, shop.Id);
			if (foodExist) throw new InvalidOperationException($"Food with name {request.Name} is already exist!");

			var categoryExist = await _categoryRepo.IsCategoryExist(request.CategoryId);
			if (!categoryExist) throw new EntityNotFoundException($"Category not found");

			var foodCreated = _mapper.Map<Food>(request);
			foodCreated.ShopId = shop.Id;

			string photoUrl = await _cloudinaryService.UploadPhoto(request.Image, $"food_delivery/Shop/{shop.Name}/Product");
			foodCreated.Image = photoUrl;
			await _context.Foods.AddAsync(foodCreated);
			await _context.SaveChangesAsync();

			return foodCreated;
		}

		public async Task<Food> UpdateFoodStatus(int id)
		{
			var food = await _foodRepo.GetFoodByIdAsync(id);
			if (food == null) throw new EntityNotFoundException("Food not found!");
			food.Available = !food.Available;

			await _foodRepo.UpdateFood(food);

			return food;
		}
	}
}
