using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using PortfolioMVC.Areas.Admin.Models;
using PortfolioMVC.Controllers;
using PortfolioMVC.Data.Business;
using PortfolioMVC.Data.Utils;
using PortfolioMVC.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PortfolioMVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class LoginController : BaseController
    {
        private readonly IConfiguration _config;
        private readonly UserService _userService;

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //Eğer giriş yaptıysa doğrudan Admni anasayfasına yönlendir.
            if (this.IsLoggedIn)
            {
                context.Result = new RedirectToActionResult("Index", "Home", new { area = "Admin" });
                return;
            }
            base.OnActionExecuting(context);
        }

        public LoginController(IConfiguration config, UserService userService)
        {
            _config = config;
            _userService = userService;
        }
        public ActionResult Index()
        {
            return View(new LoginModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(LoginModel model)
        {
   
            if (!ModelState.IsValid)
                return View(model);

            var user = _userService.GetUserByName(model.Username);
            if(user == null || !PasswordUtils.VerifyPassword(user.PasswordHash, model.Password))
            {
                ModelState.AddModelError("Username", "Kullanıcı adı veya şifre hatalı.");
                return View(model);
            }
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };
            var jwtSettings = _config.GetSection("JwtSettings").Get<JwtSettings>()!;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtSettings.Issuer,
                audience: jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(jwtSettings.ExpireMinutes),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            Response.Cookies.Append("jwt", tokenString, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(jwtSettings.ExpireMinutes)
            });

            return RedirectToAction("Index", "Home", new { area = "Admin" });
        }
    }
}
