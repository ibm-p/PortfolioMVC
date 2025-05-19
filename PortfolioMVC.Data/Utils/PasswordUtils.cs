using Microsoft.AspNetCore.Identity;
using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Utils
{
    public class PasswordUtils
    {
        /// <summary>
        /// Her defasında tekrar tekrar oluşturmaya gerek yok.
        /// </summary>
        private readonly static PasswordHasher<User> hasher = new PasswordHasher<User>();
        private readonly static User user = new User();
        /// <summary>
        /// Kullanıcı şifresini ekstra şifreler.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string HashPassword(string password)
        {

            return hasher.HashPassword(user, password);
        }

        /// <summary>
        /// Kullanıcı tarafından girilen şifrenin hash değeri ile veritabanındaki kullanıcının hash değerini kontrol etmek için.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="hashedPassword"></param>
        /// <param name="password"></param>
        /// <returns></returns>

        public static bool VerifyPassword(string hashedPassword, string password)
        {
            var result = hasher.VerifyHashedPassword(user, hashedPassword, password);
            return result == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Success;
        }
    }
}
