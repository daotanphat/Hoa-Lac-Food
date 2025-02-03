using BusinessObjects;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FoodDeliveryAPI.Service.Implement
{
	public class TokenServiceImpl : ITokenService
	{
		private readonly IConfiguration _config;
		private readonly SymmetricSecurityKey _key;
		private readonly UserManager<AppUser> _userManager;
		public TokenServiceImpl(IConfiguration config, UserManager<AppUser> userManager)
		{
			_config = config;
			_userManager = userManager;
			_key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
		}

		public string CreateToken(AppUser user)
		{
			var claims = new List<Claim>
			{
				new Claim(JwtRegisteredClaimNames.Email, user.Email)
			};

			var roles = _userManager.GetRolesAsync(user).Result;
			claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

			var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(claims),
				Expires = DateTime.Now.AddDays(7),
				SigningCredentials = credentials,
				Issuer = _config["JWT:Issuer"],
				Audience = _config["JWT:Audience"]
			};

			var tokenHandler = new JwtSecurityTokenHandler();

			var token = tokenHandler.CreateToken(tokenDescriptor);

			return tokenHandler.WriteToken(token);
		}
	}
}
