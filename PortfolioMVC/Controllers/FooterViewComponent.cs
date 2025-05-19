using Microsoft.AspNetCore.Mvc;
using PortfolioMVC.Data.Business;
using PortfolioMVC.Data.Entity;

namespace PortfolioMVC.Controllers
{
    public class FooterViewComponent : ViewComponent
    {
        private PersonalService _personalService;

        public FooterViewComponent(PersonalService personalService)
        {
            _personalService = personalService;
        }

        public IViewComponentResult Invoke()
        {
            var model = _personalService.GetPersonal();
            return View(model);
        }
    }
}
