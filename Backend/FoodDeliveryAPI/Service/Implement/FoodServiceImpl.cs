using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Food.Request;
using BusinessObjects.Dtos.Food.Response;
using BusinessObjects.Dtos.Shop.Response;
using FoodDeliveryAPI.Exceptions;
using FoodDeliveryAPI.Repository;
using Microsoft.IdentityModel.Tokens;

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
			if (foodExist) throw new ArgumentException($"Food with name {request.Name} is already exist in this shop!");

			var categoryExist = await _categoryRepo.IsCategoryExist(request.CategoryId);
			if (!categoryExist) throw new ArgumentException($"Category with id {request.CategoryId} not found");

			var foodCreated = _mapper.Map<Food>(request);
			foodCreated.Category = await _categoryRepo.GetCategoryByIdAsync(request.CategoryId);
			foodCreated.ShopId = shop.Id;

			string photoUrl = await _cloudinaryService.UploadPhoto(request.Image, $"food_delivery/Shop/{shop.Name}/Product");
			foodCreated.Image = photoUrl;

			var food = await _foodRepo.CreateFoodAsync(foodCreated);
			return food;
		}

		public IQueryable<Food> GetAllFood()
		{
			return _foodRepo.GetAllFoodAsync();
		}

		public IQueryable<Food> GetAllFoodByShop(int shopId)
		{
			return _foodRepo.GetAllFoodByShopAsync(shopId);
		}

		public async Task<Food> GetFoodDetails(int id)
		{
			return await _foodRepo.GetFoodByIdAsync(id) ?? throw new EntityNotFoundException($"Food with id {id} not found!");
		}

		public async Task<FoodResponseDto> UpdateFood(int id, UpdateFoodRequestDto request, AppUser user)
		{
			bool isFoodChanged = false;

			var food = await _foodRepo.GetFoodByIdAsync(id);
			if (food == null) throw new EntityNotFoundException("Food not found!");

			if (request.CategoryId.HasValue)
			{
				var category = await _categoryRepo.GetCategoryByIdAsync(request.CategoryId.Value);
				if (category == null) throw new EntityNotFoundException("Category not found!");
			}


			var shop = await _shopRepo.GetShopByUser(user);
			var isFoodExistInShop = food.ShopId == shop.Id;
			if (!isFoodExistInShop) throw new EntityNotFoundException("Food not exist in shop!");

			if (!string.IsNullOrEmpty(request.Name) && food.Name != request.Name)
			{
				if (await _foodRepo.IsFoodExist(request.Name, shop.Id))
					throw new ArgumentException("Food Name already exist in shop");
				food.Name = request.Name;
				isFoodChanged = true;
			}
			if (request.Price.HasValue && food.Price != request.Price)
			{
				food.Price = request.Price.Value;
				isFoodChanged = true;
			}
			if (request.Quantity.HasValue && food.Quantity != request.Quantity)
			{
				food.Quantity = request.Quantity.Value;
				isFoodChanged = true;
			}
			if (request.CategoryId.HasValue && food.CategoryId != request.CategoryId)
			{
				food.CategoryId = request.CategoryId.Value;
				isFoodChanged = true;
			}
			if (request.Image != null)
			{
				if (request.Image.Length > 10 * 1024 * 1024)
					throw new ArgumentException("File size exceeds the 10MB limit.");
				string photoUrl = await _cloudinaryService.UploadPhoto(request.Image, $"food_delivery/Shop/{food.Shop.Name}/Product");
				food.Image = photoUrl;
				isFoodChanged = true;
			}

			if (!isFoodChanged) return null;

			await _foodRepo.UpdateFoodAsync(food);
			var response = _mapper.Map<FoodResponseDto>(food);
			return response;
		}

		public async Task<Food> UpdateFoodStatus(int id)
		{
			var food = await _foodRepo.GetFoodByIdAsync(id);
			if (food == null) throw new EntityNotFoundException("Food not found!");
			food.Available = !food.Available;

			await _foodRepo.UpdateFoodAsync(food);

			return food;
		}
	}
}
