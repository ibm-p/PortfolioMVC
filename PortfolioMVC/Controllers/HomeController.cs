using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioMVC.Data;
using PortfolioMVC.Data.Business;
using PortfolioMVC.Data.Entity;
using PortfolioMVC.Extensions;
using PortfolioMVC.Models;

namespace PortfolioMVC.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        PersonalService _personalService;
        ContactService _contactService;



        public HomeController(ILogger<HomeController> logger, PDbContext context, PersonalService personalService, ContactService contactService)
        {
            _logger = logger;
            _personalService = personalService;
            _contactService = contactService;
        }

        public IActionResult Index()
        {
            var model = _personalService.GetPersonal();
            return View(model);
        }
        public IActionResult About()
        {
            return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Contact() {
            var model = _personalService.GetPersonal();
            return View(model);
        }
        [HttpPost]
        public IActionResult ContactForm(Contact model)
        {
            //Geriye string dönderiyoruz.
            if(!ModelState.IsValid)
            {
                string err = ModelState.GetModelErrors();
                return Content(err);
            }
            _contactService.AddOrUpdate(model);
            _contactService.SaveChanges();
            return Content("OK");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
