using AutoMapper;
using BusinessObjects;
using BusinessObjects.Mappers;
using FoodDeliveryAPI.Service;
using FoodDeliveryAPI.Service.Implement;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var mapperConfig = new MapperConfiguration(mc => mc.AddProfile(new MapperConfig()));
IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
	options.Password.RequireDigit = true;
	options.Password.RequireLowercase = true;
	options.Password.RequireUppercase = true;
	options.Password.RequireNonAlphanumeric = true;
	options.Password.RequiredLength = 8;

	options.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<ApplicationDBContext>();

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme =
	options.DefaultChallengeScheme =
	options.DefaultForbidScheme =
	options.DefaultForbidScheme =
	options.DefaultSignInScheme =
	options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidIssuer = builder.Configuration["JWT:Issuer"],
		ValidateAudience = true,
		ValidAudience = builder.Configuration["JWT:Audience"],
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(
			System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
		)
	};
});

builder.Services.AddScoped<ITokenService, TokenServiceImpl>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(x => x.AllowAnyMethod()
				.AllowAnyHeader()
				.AllowCredentials()
				.WithOrigins("http://localhost:3000")
				.SetIsOriginAllowed(origin => true));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
