using Microsoft.AspNetCore.Diagnostics;

namespace FoodDeliveryAPI.Exceptions
{
	public class GlobalExceptionHanlder : IExceptionHandler
	{
		public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, System.Exception exception, CancellationToken cancellationToken)
		{
			httpContext.Response.ContentType = "application/json";

			var (statusCode, message) = exception switch
			{
				EntityNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
				InvalidOperationException => (StatusCodes.Status400BadRequest, exception.Message),
				ArgumentException => (StatusCodes.Status400BadRequest, exception.Message),
				ForbiddenException => (StatusCodes.Status403Forbidden, exception.Message),
				_ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
			};

			httpContext.Response.StatusCode = statusCode;
			await httpContext.Response.WriteAsJsonAsync(new { message }, cancellationToken);
			return true;
		}
	}
}
