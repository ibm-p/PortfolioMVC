using System.Reflection;
using System.Text.RegularExpressions;
using System.Text;
using PortfolioMVC.Utils.Utils;

namespace PortfolioMVC.Utils.Extensions
{
    public class StringInterPolateOptions
    {
        /// <summary>
        /// Bir değer bulunamadığı zaman, hangi dönüş yapılacak, varsayılan olarak aynı değeri dönecek.
        /// </summary>
        public Func<string, string> FallBack { get; set; }
        public string Prefix { get; set; }
    }
    public static class StringExtensions
    {
        public const string Regex_Web = @"([\r\n\t\s]|^)(((http|https|ftp|telnet|file|steam|ftps|sftp)(://))|(www|ftp)(\.))([a-zA-Z0-9çÇğĞıİöÖşŞüÜ_\-\+\=&!'\^é""<:>\./\\;~\,\?\@\[\]]+)";
        public const string Regex_Mail = @"\b([a-zA-Z0-9çÇğĞıİöÖşŞüÜ_\-\+\=&!'\^é""<:>\./\\;~\,\?]+)(\@)([\w\-_]+\.)([a-zA-Z0-9çÇğĞıİöÖşŞüÜ_\-\+\=&!'\^é""<:>\./\\;~\,\?\]]+)";
        public const string Regex_Ip = @"^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
        public const string Regex_Port = @"^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$";
        public static string InterpolateDefaultPrefix = "%";

        public static bool IsMail(this string url)
        {
            if (Regex.IsMatch(url, Regex_Mail))
            {
                return true;
            }
            return false;
        }
        public static bool IsIp(this string ipaddr)
        {
            if (Regex.IsMatch(ipaddr, Regex_Ip))
            {
                return true;
            }
            return false;
        }
        public static bool IsUrl(this string url)
        {
            if (Regex.IsMatch(url, Regex_Web))
            {
                return true;
            }
            return false;
        }
        public static decimal ToDecimal(this string input, decimal defaultValue = 0)
        {
            if (decimal.TryParse(input, out decimal outValue))
            {
                return outValue;
            }
            return defaultValue;
        }
        public static int? TryToInt32(this string input)
        {
            if (int.TryParse(input, out int outValue))
            {
                return outValue;
            }
            return null;
        }
        public static int ToInt32(this string input, int defaultValue = 0)
        {

            if (int.TryParse(input, out int outValue))
            {
                return outValue;
            }
            return defaultValue;
        }
        public static long ToInt64(this string input, long defaultValue = 0)
        {

            if (long.TryParse(input, out long outValue))
            {
                return outValue;
            }
            return defaultValue;
        }
        public static DateTime? TryToDateTime(this string input)
        {

            if (DateTime.TryParse(input, out DateTime outValue))
            {
                return outValue;
            }
            return null;
        }
        public static DateTime ToDateTime(this string input, DateTime defaultValue = default)
        {

            if (DateTime.TryParse(input, out DateTime outValue))
            {
                return outValue;
            }
            return defaultValue;
        }
        /// <summary>
        /// Bir metni birdan fazla dizi içerisinde olup olmadığını kontrol etmek için kullanılır.
        /// </summary>
        /// <param name="input">Aranacak metin</param>
        /// <param name="inputs">Aranacak metin dizisi</param>
        /// <returns>Aranan metin herhangi bir dizi içerisinde mevcut ise true dönderir.</returns>
        public static bool ContainsIn(this string input, params string[] inputs)
        {
            return inputs.Contains(input);
        }
        public static bool ContainsIn(this string input, string v, IEqualityComparer<string> comparer, params string[] inputs)
        {
            return inputs.Contains(input, comparer);
        }
        public static bool Contains(this string input, string value, StringComparison comparisonType)
        {
            return input.IndexOf(value, comparisonType) >= 0;
        }

        public static string Interpolate(this string input, object vars, string prefix = null)
        {
            return input.Interpolate(vars, new StringInterPolateOptions()
            {
                Prefix = prefix
            });
        }

        /// <summary>
        /// {test} içerik gibi methi, verilen paremetrelere göre biçimlendirir.
        /// </summary>
        /// <param name="input">Biçimlendirilecek metin</param>
        /// <param name="vars">Biçimlendirilecek nesne Dictionary veya Sınıf olmalıdır.</param>
        /// <param name="prefix">Örneğin % girilirse, parametre {%test} olarak kullanılmalıdır.</param>
        /// <returns>{%test} test -> 1 test olarak dönüş yapar.</returns>
        public static string Interpolate(this string input, object vars, StringInterPolateOptions options)
        {
            if (string.IsNullOrEmpty(input)) return input;
            if (vars == null) return input;
            if (options == null)
                options = new StringInterPolateOptions();

            if (options.Prefix == null)
            {
                options.Prefix = InterpolateDefaultPrefix;
            }
            bool isDictionary = vars is IDictionary<string, object>;
            IEnumerable<PropertyInfo> props = null;
            if (!isDictionary)
                props = vars.GetType().GetProperties().Where(m => m.CanRead);
            return Regex.Replace(input, $@"\{{( +)?{options.Prefix}(?<name>(([a-zA-Z])|([a-zA-Z][\w\d]+)))( +)?\}}", delegate (Match m) {

                var name = m.Result("${name}");
                if (!isDictionary)
                {
                    var prop = props?.FirstOrDefault(p => p.Name == name);
                    if (prop != null)
                    {
                        return prop?.GetValue(vars, null)?.ToString() ?? "";
                    }
                }
                else
                {
                    object v;
                    if (((IDictionary<string, object>)vars).TryGetValue(name, out v))
                    {
                        return v?.ToString() ?? "";
                    }
                }
                return options.FallBack != null ? (options.FallBack(name) ?? "") : (name ?? "");
            });
        }
        public static string EncryptAES(this string input, string password, AesKeySize keySize = AesKeySize.KS_16)
        {
            var size = Cipher.GetKeySizeFrom(keySize);
            if (password.Length > size)
            {
                password = password.Substring(0, size);
            }
            else
            {
                StringBuilder sb = new StringBuilder();
                for (int i = password.Length; i < size; i++)
                {
                    sb.Append("*");
                }
                password += sb;
            }
            byte[] inputbytes = Encoding.UTF8.GetBytes(input);
            byte[] passbytes = Encoding.UTF8.GetBytes(password);
            if (passbytes.Length > size + 1)
            {
                Array.Resize(ref passbytes, size);
            }
            var iv = Cipher.DefaultIV;
            byte[] outbytes = Cipher.AES_EncryptByte(inputbytes, passbytes, iv, keySize);
            return Convert.ToBase64String(outbytes);
        }
        public static string DecryptAES(this string input, string password, AesKeySize keySize = AesKeySize.KS_16)
        {
            var size = Cipher.GetKeySizeFrom(keySize);

            if (password.Length > size)
            {
                password = password.Substring(0, size);
            }
            else
            {
                StringBuilder sb = new StringBuilder();
                for (int i = password.Length; i < size; i++)
                {
                    sb.Append("*");
                }
                password += sb;
            }
            byte[] inputbytes = Convert.FromBase64String(input);
            byte[] passbytes = Encoding.UTF8.GetBytes(password);
            if (passbytes.Length > size + 1)
            {
                Array.Resize(ref passbytes, size);
            }
            var iv = Cipher.DefaultIV;

            byte[] outbytes = Cipher.AES_DecryptByte(inputbytes, passbytes, iv, keySize);
            return Encoding.UTF8.GetString(outbytes);
        }
        public static bool IsNotEmpty(this string value) => !string.IsNullOrEmpty(value);
        public static bool IsEmpty(this string value) => string.IsNullOrEmpty(value);
        public static bool IsGuid(this string value) => value.IsNotEmpty() && Guid.TryParse(value, out var id);
        public static string ToMD5(this string input)
        {
            return Cipher.ConvertToMD5(input);
        }
        public static string Truncate(this string input, int maxLength, string truncateString = "")
        {
            if (input.Length > (maxLength - truncateString.Length))
            {
                return input.Substring(0, maxLength - truncateString.Length) + truncateString;
            }
            return input;
        }
        /// <summary>
        /// Length ile aynı, tek farkı null olduğu zaman 0 döner.
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static int Length(this string input)
        {
            return input?.Length ?? 0;
        }
        public static bool Md5Match(this string input, string md5)
        {
            return Cipher.Md5Matches(input, md5);
        }
        public static string ToBase64(this string input)
        {
            byte[] textBytes = Encoding.UTF8.GetBytes(input);
            return Convert.ToBase64String(textBytes);
        }
        public static string FromBase64(this string input)
        {
            return StringUtils.Base64Decode(input);
        }

    }

}
