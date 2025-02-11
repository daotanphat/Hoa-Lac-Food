using AutoMapper;
using BusinessObjects;
using BusinessObjects.Dtos.Shop.Request;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Service.Implement
{
	public class ShopServiceImpl : IShopService
	{
		private readonly ApplicationDBContext _context;
		private readonly IMapper _mapper;
		private readonly ICloudinaryService _cloudinaryService;
		public ShopServiceImpl(ApplicationDBContext context, IMapper mapper,
			ICloudinaryService cloudinaryService)
		{
			_context = context;
			_mapper = mapper;
			_cloudinaryService = cloudinaryService;
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
	}
}
