using BusinessObjects;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FoodDeliveryAPI.Config;

namespace FoodDeliveryAPI.Service.Implement
{
	public class CloudinaryServiceImpl : ICloudinaryService
	{
		private readonly IConfiguration _configuration;
		private readonly CloudinarySettings _settings;
		private readonly Cloudinary _cloudinary;
		public CloudinaryServiceImpl(IConfiguration configuration)
		{
			_configuration = configuration;
			_settings = _configuration.GetSection("CloudinarySettings").Get<CloudinarySettings>();
			Account account = new Account(
				_settings.CloudName,
				_settings.ApiKey,
				_settings.ApiSecret);

			_cloudinary = new Cloudinary(account);
		}
		public string UploadPhoto(IFormFile photo, string folderName)
		{
			var uploadResult = new ImageUploadResult();

			if (photo.Length > 0)
			{
				using (var stream = photo.OpenReadStream())
				{
					var uploadParams = new ImageUploadParams()
					{
						File = new FileDescription(photo.Name, stream),
						Folder = folderName
					};

					uploadResult = _cloudinary.Upload(uploadParams);
				}
			}

			return uploadResult.SecureUrl.ToString();
		}
	}
}
