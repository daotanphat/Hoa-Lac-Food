using BusinessObjects;

namespace FoodDeliveryAPI.Service
{
	public interface ICloudinaryService
	{
		string UploadPhoto(IFormFile photo, string folderName);
	}
}
