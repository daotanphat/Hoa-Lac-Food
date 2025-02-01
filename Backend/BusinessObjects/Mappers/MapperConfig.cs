﻿using AutoMapper;
using BusinessObjects.Dtos.Auth.Response;
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
		}
	}
}
