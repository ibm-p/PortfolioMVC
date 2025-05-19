using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Utils.Utils
{
    public enum AesKeySize
    {
        KS_16,
        KS_24,
        KS_32
    }

    public class Cipher
    {
        public static int GetKeySizeFrom(AesKeySize keySize)
        {
            switch (keySize)
            {

                case AesKeySize.KS_24:
                    return 24;
                case AesKeySize.KS_32:
                    return 32;
                case AesKeySize.KS_16:
                default:
                    return 16;
            }

        }
        private static string key = "_TEST1aci19%";
        private static byte[] defaultIV = Encoding.UTF8.GetBytes("(Portfoli.Utils)");
        public static byte[] DefaultIV
        {
            get
            {
                return defaultIV;
            }
            set
            {
                defaultIV = value;
            }
        }
        public static byte[] AES_GenerateIV()
        {
            using (Aes des = Aes.Create())
            {
                return des.IV;
            }
        }
        public static byte[] AES_EncryptByte(byte[] data, byte[] key, byte[] IV, AesKeySize keySize = AesKeySize.KS_16)
        {

            int size = GetKeySizeFrom(keySize);
            if (data == null || data.Length <= 0 || key == null || key.Length < 8 || key.Length > size) return new byte[0];
            byte[] encrypted = new byte[0];
            using (Aes des = Aes.Create())
            {
                if (IV == null) IV = des.IV;
                des.Key = key;
                des.KeySize = size * 8;

                des.IV = IV;
                ICryptoTransform cryptoTransform = des.CreateEncryptor(key, des.IV);
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, cryptoTransform, CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(data, 0, data.Length);
                    }
                    encrypted = memoryStream.ToArray();
                    memoryStream.Close();
                }
            }

            return encrypted;
        }
        public static byte[] AES_DecryptByte(byte[] data, byte[] key, byte[] IV, AesKeySize keySize = AesKeySize.KS_16)
        {
            int size = GetKeySizeFrom(keySize);

            if (data == null || data.Length <= 0 || key == null || key.Length < 8 || key.Length > size || IV == null || IV.Length != 16) return new byte[0];
            byte[] decrytped;
            byte[] ibuffer = new byte[1024];
            List<byte> totalBytesRead = new List<byte>();
            using (Aes des = Aes.Create())
            {
                des.Key = key;
                des.KeySize = size * 8;
                des.IV = IV;
                ICryptoTransform cryptoTransform = des.CreateDecryptor(key, IV);
                using (MemoryStream memoryStream = new MemoryStream(data))
                {
                    try
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memoryStream, cryptoTransform, CryptoStreamMode.Read))
                        {
                            int readed = 0;
                            while ((readed = cryptoStream.Read(ibuffer, 0, ibuffer.Length)) > 0)
                            {
                                for (int i = 0; i < readed; i++)
                                {
                                    totalBytesRead.Add(ibuffer[i]);
                                }
                            }

                        }
                    }
                    catch (Exception)
                    {

                        return new byte[0];
                    }

                    decrytped = totalBytesRead.ToArray();
                    memoryStream.Close();
                }
            }
            return decrytped;
        }
        public static bool Md5Matches(string source, string target)
        {
            StringComparer comparer = StringComparer.OrdinalIgnoreCase;
            if (comparer.Compare(source, target) == 0)
            {
                return true;
            }
            return false;
        }
        public static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                return StringUtils.ToHexString(hashBytes);
            }
        }
        public static string ConvertToMD5(string variant)
        {
            using (MD5 md5Hash = MD5.Create())
            {
                string hash = GetMd5Hash(md5Hash, variant);
                return hash;
            }
        }
        private static string GetMd5Hash(MD5 md5Hash, string input)
        {
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }
        public static string Encrypt(string toEncrypt, bool useHashing)
        {
            byte[] keyArray;
            byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);
            // Get the key from config file

            if (useHashing)
            {
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                hashmd5.Clear();
            }
            else
                keyArray = UTF8Encoding.UTF8.GetBytes(key);
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            //set the secret key for the tripleDES algorithm
            tdes.Key = keyArray;
            //mode of operation. there are other 4 modes.
            //We choose ECB(Electronic code Book)
            tdes.Mode = CipherMode.ECB;
            //padding mode(if any extra byte added)
            tdes.Padding = PaddingMode.PKCS7;
            ICryptoTransform cTransform = tdes.CreateEncryptor();
            //transform the specified region of bytes array to resultArray
            byte[] resultArray =
            cTransform.TransformFinalBlock(toEncryptArray, 0,
            toEncryptArray.Length);
            //Release resources held by TripleDes Encryptor
            tdes.Clear();
            //Return the encrypted data into unreadable string format
            return Convert.ToBase64String(resultArray, 0, resultArray.Length).Replace("+", "-").Replace("/", "_");
        }
        public static int Decrypt(string cipherString, bool useHashing)
        {
            if (cipherString == "" || cipherString == null)
            {
                return 0;
            }
            cipherString = cipherString.Replace("-", "+").Replace("_", "/");
            byte[] keyArray;
            byte[] toEncryptArray = Convert.FromBase64String(cipherString);
            if (useHashing)
            {
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                hashmd5.Clear();
            }
            else
                keyArray = UTF8Encoding.UTF8.GetBytes(key);
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;
            ICryptoTransform cTransform = tdes.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
            tdes.Clear();
            return Convert.ToInt32(UTF8Encoding.UTF8.GetString(resultArray));
        }

        public static string Md5Sifrele(string sifrelenecekIfade)
        {
            MD5 s = new MD5CryptoServiceProvider();
            byte[] orjinalHali = ASCIIEncoding.Default.GetBytes(sifrelenecekIfade);
            byte[] sifreliHali = s.ComputeHash(orjinalHali);
            string sifre = BitConverter.ToString(sifreliHali);
            return sifre;
        }

        public static string DecryptString(string cipherString, bool useHashing)
        {
            if (cipherString == "" || cipherString == null)
            {
                return "";
            }
            cipherString = cipherString.Replace("-", "+").Replace("_", "/");
            byte[] keyArray;
            byte[] toEncryptArray = Convert.FromBase64String(cipherString);
            if (useHashing)
            {
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                hashmd5.Clear();
            }
            else
                keyArray = UTF8Encoding.UTF8.GetBytes(key);
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;
            ICryptoTransform cTransform = tdes.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
            tdes.Clear();
            return Convert.ToString(UTF8Encoding.UTF8.GetString(resultArray));
        }

        public static string Base64Decode(string base64EncodedData)
        {
            try
            {
                var modAl = base64EncodedData.Length % 4;
                if (modAl > 0) base64EncodedData += new string('=', 4 - modAl);
                var data = Convert.FromBase64String(base64EncodedData);
                var decodedString = Encoding.UTF8.GetString(data);
                return decodedString;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }
        public static string AESEncrypt(string plainText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes("0123456789ABCDEF");
                aes.IV = Encoding.UTF8.GetBytes("FEDCBA9876543210");

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter sw = new StreamWriter(cs))
                        {
                            sw.Write(plainText);
                        }
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }
        public static string AESDecrypt(string cipherText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes("0123456789ABCDEF");
                aes.IV = Encoding.UTF8.GetBytes("FEDCBA9876543210");

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(cipherText)))
                {
                    using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader sr = new StreamReader(cs))
                        {
                            return sr.ReadToEnd();
                        }
                    }
                }
            }
        }
     
    }
}
