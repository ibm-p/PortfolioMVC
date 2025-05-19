using System.Reflection;
using System.Text.RegularExpressions;
using System.Text;
using PortfolioMVC.Utils.Extensions;

namespace PortfolioMVC.Utils.Utils
{
    public class StringUtils
    {
        private static Random random = new Random();

        public static string ToHexString(byte[] bytes)
        {
            var sb = new StringBuilder();
            foreach (var t in bytes)
            {
                sb.Append(t.ToString("X2"));
            }
            return sb.ToString();
        }
        public static string ToHexString(string str)
        {
            return ToHexString(Encoding.Unicode.GetBytes(str));
        }
        public static string NormalizePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber))
                return phoneNumber;
            string cleanedNumber = Regex.Replace(phoneNumber, @"[^\d]", "");
            cleanedNumber = Regex.Replace(cleanedNumber, @"^(\+?(90)|(0)|(8080)|(80))", "");
            return cleanedNumber;
        }
        const string TelefonRegex = @"^(0)?(\+(\d{1,3}))?(\s|\-)?(\(?\d{1,4}\)?[\s\-]?)?(\d{1,4})[\s\-]?\d{1,4}[\s\-]?\d{1,4}$";

        public static bool IsPhoneNumber(string v)
        {
            return Regex.IsMatch(v, TelefonRegex);
        }
        public static string ShortGuid() => Guid.NewGuid().ToString("n");

        public static string RandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return Encoding.UTF8.GetString(base64EncodedBytes);
        }
        /// <summary>
        /// string.Join ile farkı boş entryler için ekleme yapmaz
        /// </summary>
        /// <param name="seperator"></param>
        /// <param name="strings"></param>
        /// <returns></returns>
        public static string Join(string seperator, params object[] strings)
        {
            return string.Join(seperator, strings.Where(s => s != null && s.ToString().IsNotEmpty()));
        }
    }
}
