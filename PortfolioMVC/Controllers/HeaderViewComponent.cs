using Microsoft.AspNetCore.Mvc;
using PortfolioMVC.Data.Business;
using PortfolioMVC.Data.Entity;

namespace PortfolioMVC.Controllers
{
    public class HeaderViewComponent : ViewComponent
    {
        private PersonalService _personalService;

        public HeaderViewComponent(PersonalService personalService)
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
