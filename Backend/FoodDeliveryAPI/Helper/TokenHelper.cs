namespace FoodDeliveryAPI.Helper
{
	public static class TokenHelper
	{
		public static string ExtractBearerToken(string header)
		{
			if (string.IsNullOrEmpty(header) || !header.StartsWith("Bearer "))
				throw new UnauthorizedAccessException("Invalid or missing authorization token!");

			return header["Bearer ".Length..].Trim();
		}
	}
}
