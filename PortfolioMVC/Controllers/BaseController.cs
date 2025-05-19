using Microsoft.AspNetCore.Mvc;

namespace PortfolioMVC.Controllers
{
    public class BaseController :Controller
    {
        public bool IsLoggedIn => User.Identity?.IsAuthenticated ?? false;
        public string Username => User.Identity?.Name ?? string.Empty;
    }
}
