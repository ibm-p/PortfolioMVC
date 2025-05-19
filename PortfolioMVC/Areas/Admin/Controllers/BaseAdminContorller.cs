using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PortfolioMVC.Controllers;

namespace PortfolioMVC.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class BaseAdminController : BaseController
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!this.IsLoggedIn) {
                context.Result = new RedirectToActionResult("Index", "Login", new { area = "Admin" });
                return;
            }
            base.OnActionExecuting(context);
        }
    }
}
