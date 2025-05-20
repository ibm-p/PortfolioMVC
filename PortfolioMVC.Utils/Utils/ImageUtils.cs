using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PortfolioMVC.Utils.Utils
{
    public class ImageUtils
    {
        public static string Base64ToImage(string base64String, string? folderPath)
        {
            try
            {
                var match = Regex.Match(base64String, @"data:image/(?<type>.+?);base64,(?<data>.+)");
                string fileType = match.Groups["type"].Value; 
                string base64Data = match.Groups["data"].Value;
                byte[] imageBytes = Convert.FromBase64String(base64Data);
                string name = "i_" + StringUtils.RandomString(8) + "." + fileType;

                // Kayıt yeri (wwwroot/images/logo.png gibi)
                string _folderPath = folderPath?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(_folderPath);
                string filePath = Path.Combine(_folderPath, name);
                System.IO.File.WriteAllBytes(filePath, imageBytes);
                return "/images/" + name;
            }
            catch (Exception)
            {

            }
            return "default";
        }
        public static bool IsBase64WithMime(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return false;

            var regex = new Regex(@"^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$", RegexOptions.Compiled);
            return regex.IsMatch(input);
        }
    }
}
