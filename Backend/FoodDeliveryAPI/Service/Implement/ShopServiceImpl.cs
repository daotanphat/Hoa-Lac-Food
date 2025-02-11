using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Shop.Request;
using FoodDeliveryAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Service.Implement
{
	public class ShopServiceImpl : IShopService
	{
		private readonly ApplicationDBContext _context;
		private readonly IMapper _mapper;
		private readonly ICloudinaryService _cloudinaryService;
		private readonly ShopRepository _shopRepository;
		public ShopServiceImpl(ApplicationDBContext context, IMapper mapper,
			ICloudinaryService cloudinaryService, ShopRepository shopRepository)
		{
			_context = context;
			_mapper = mapper;
			_cloudinaryService = cloudinaryService;
			_shopRepository = shopRepository;
		}
		public async Task<Shop> CreateShop(CreateShopRequestDto request, AppUser user, IFormFile photo)
		{
			if (!await IsShopNameUnique(request.Name))
			{
				throw new ArgumentException("Shop name already exist");
			}

			var shopCreated = _mapper.Map<Shop>(request);
			shopCreated.Users.Add(user);

			string photoUrl = await _cloudinaryService.UploadPhoto(photo, $"food_delivery/Shop/{shopCreated.Name}");
			shopCreated.Image = photoUrl;

			await _context.Shops.AddAsync(shopCreated);
			await _context.SaveChangesAsync();

			return shopCreated;
		}

		public async Task<bool> IsShopNameUnique(string name)
		{
			return !await _context.Shops.AnyAsync(s => s.Name == name);
		}

		public async Task<Shop> UpdateShopStatement(string shopName)
		{
			if (shopName == null) return null;

			var shop = await _shopRepository.GetShopByName(shopName);
			if (shop == null) return null;

			shop.IsOpen = !shop.IsOpen;
			_context.Shops.Update(shop);
			await _context.SaveChangesAsync();

			return shop;
		}
	}
}
