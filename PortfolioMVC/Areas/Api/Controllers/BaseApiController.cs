using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PortfolioMVC.Controllers;

namespace PortfolioMVC.Areas.Api.Controllers
{
    [Area("Api")]
    public class BaseApiController : ControllerBase
    {
        public bool IsLoggedIn => User.Identity?.IsAuthenticated ?? false;
        public string Username => User.Identity?.Name ?? string.Empty;
    }
}
