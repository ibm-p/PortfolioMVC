
using Microsoft.IdentityModel.Tokens;
using PortfolioMVC.Utils;
using PortfolioMVC.Utils.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PortfolioMVC.Services
{
    public class ImageService
    {
        public const string Invalid = "Invalid";
        private readonly IWebHostEnvironment _env;
        public ImageService(IWebHostEnvironment env)
        {
            _env = env;
        }
        public bool IsValidBase64(string input) => ImageUtils.IsBase64WithMime(input);
        public string SaveImage(string? input)
        {
            if (string.IsNullOrEmpty(input) || !this.IsValidBase64(input))
                return Invalid;
            string dir =  Path.Combine(_env.WebRootPath, "images");
            string loc = ImageUtils.Base64ToImage(input, dir);
            return loc;
        }
        public void DeleteImage(string fname)
        {
            string path = Path.Combine(_env.WebRootPath, fname);
            if (File.Exists(path))
                File.Delete(path);
        }
    }

}