using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Shop.Request;
using BusinessObjects.Dtos.Shop.Response;
using FoodDeliveryAPI.Exceptions;
using FoodDeliveryAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Service.Implement
{
	public class ShopServiceImpl : IShopService
	{
		private readonly ApplicationDBContext _context;
		private readonly IMapper _mapper;
		private readonly ICloudinaryService _cloudinaryService;
		private readonly ShopRepository _shopRepo;
		public ShopServiceImpl(ApplicationDBContext context, IMapper mapper,
			ICloudinaryService cloudinaryService, ShopRepository shopRepo)
		{
			_context = context;
			_mapper = mapper;
			_cloudinaryService = cloudinaryService;
			_shopRepo = shopRepo;
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

		public IQueryable<ShopResponseDto> GetShopList()
		{
			var shops = _shopRepo.GetShops();
			var response = _mapper.Map<IEnumerable<ShopResponseDto>>(shops);
			return response.AsQueryable();
		}

		public async Task<bool> IsShopNameUnique(string name)
		{
			return !await _context.Shops.AnyAsync(s => s.Name == name);
		}

		public async Task<ShopResponseDto> UpdateShop(AppUser user, UpdateShopRequestDto request)
		{
			var shop = await _shopRepo.GetShopByUser(user);
			if (shop == null) throw new EntityNotFoundException("Shop not found!");

			if (!string.IsNullOrEmpty(request.Name) && request.Name != shop.Name)
			{
				bool shopNameExist = await _shopRepo.ShopNameExist(request.Name);
				if (!shopNameExist) shop.Name = request.Name;
				else throw new ArgumentException("Shop name already exist!");
			}
			if (!string.IsNullOrEmpty(request.Description) && request.Description != shop.Description)
			{
				shop.Description = request.Description;
			}
			if (!string.IsNullOrEmpty(request.Address) && request.Address != shop.Address)
			{
				shop.Address = request.Address;
			}
			if (!string.IsNullOrEmpty(request.Bank) && request.Bank != shop.Bank)
			{
				shop.Bank = request.Bank;
			}

			if (request.Photo != null)
			{
				if (request.Photo.Length > 10 * 1024 * 1024)
					throw new ArgumentException("File size exceeds the 10MB limit.");
				string photoUrl = await _cloudinaryService.UploadPhoto(request.Photo, $"food_delivery/Shop/{shop.Name}");
				shop.Image = photoUrl;
			}

			await _shopRepo.UpdateShopAsync(shop);
			var response = _mapper.Map<ShopResponseDto>(shop);
			return response;
		}

		public async Task<Shop> UpdateShopStatement(string shopName)
		{
			var shop = await _shopRepo.GetShopByName(shopName);
			if (shop == null) throw new EntityNotFoundException("Shop not found!");

			shop.IsOpen = !shop.IsOpen;
			await _shopRepo.UpdateShopAsync(shop);
			return shop;
		}

		public async Task<ShopResponseDto> UpdateShopStatus(int shopId)
		{
			var shop = await _shopRepo.GetShopByIdAsync(shopId);
			if (shop == null) throw new EntityNotFoundException("Shop not found!");

			shop.Status = !shop.Status;
			await _shopRepo.UpdateShopAsync(shop);

			var response = _mapper.Map<ShopResponseDto>(shop);
			return response;
		}
	}
}
