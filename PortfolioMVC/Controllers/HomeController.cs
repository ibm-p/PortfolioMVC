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
        PortfolioService _portfolioService;
        ServiceService _serviceService;
        AboutService _aboutService;



        public HomeController(ILogger<HomeController> logger, PDbContext context, PersonalService personalService, ContactService contactService, PortfolioService portfolioService, ServiceService serviceService, AboutService aboutService)
        {
            _logger = logger;
            _personalService = personalService;
            _contactService = contactService;
            _portfolioService = portfolioService;
            _aboutService = aboutService;
            _serviceService = serviceService;
        }

        public IActionResult Index()
        {
            var model = _personalService.GetPersonal();
            return View(model);
        }
        public IActionResult About()
        {
            AboutModel model = new AboutModel();
            model.About = _aboutService.GetAbout()!;
            model.References = _aboutService.GetReferences().ToList();
            model.Personal = _personalService.GetPersonal()!;
            return View(model);
        }
        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult Portfolio()
        {
            var cats = _portfolioService.GetCategories().ToList();
            var ports  = _portfolioService.GetAll().ToList();
            var model = new PortfolioModel()
            {
                Categories = cats,
                Portfolios = ports
            };
            return View(model);
        }
        public IActionResult Contact() {
            var model = _personalService.GetPersonal();
            return View(model);
        }


        public IActionResult Services()
        {
            List<Service> services = _serviceService.GetAll().ToList();
            return View(services);
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
