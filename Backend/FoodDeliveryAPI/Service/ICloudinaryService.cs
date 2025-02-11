using BusinessObjects;

namespace FoodDeliveryAPI.Service
{
	public interface ICloudinaryService
	{
		Task<string> UploadPhoto(IFormFile photo, string folderName);
	}
}
