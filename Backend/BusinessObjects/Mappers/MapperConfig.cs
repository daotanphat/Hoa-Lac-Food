using AutoMapper;
using BusinessObjects.Dtos.Auth.Response;
using BusinessObjects.Dtos.Shop.Request;
using BusinessObjects.Dtos.Shop.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
	public class MapperConfig : Profile
	{
		public MapperConfig()
		{
			// AppUser
			CreateMap<AppUser, RegisterResponseDto>().ReverseMap();

			// Shop
			CreateMap<CreateShopRequestDto, Shop>()
				.ForMember(dest => dest.Image, opt => opt.Ignore())
				.ReverseMap();
			CreateMap<Shop, CreateShopResponseDto>().ReverseMap();
			CreateMap<Shop, ShopResponseDto>().ReverseMap();
		}
	}
}
