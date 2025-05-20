using Microsoft.AspNetCore.Mvc;
using PortfolioMVC.Controllers;
using PortfolioMVC.Data.Business;

namespace PortfolioMVC.Areas.Admin.Controllers
{
    public class HomeController : BaseAdminController
    {

        public IActionResult Index()
        {
            return RedirectToAction("Genel");
        }
        public IActionResult Genel()
        {
            return View();
        }
        public IActionResult About()
        {
            return View();
        }
        public IActionResult Contact()
        {
            return View();
        }
        public IActionResult Portfolio()
        {
            return View();
        }
        public IActionResult Service()
        {
            return View();
        }
        [HttpGet]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return RedirectToAction("Index", "Login", new { area = "Admin" });
        }
    }
}
