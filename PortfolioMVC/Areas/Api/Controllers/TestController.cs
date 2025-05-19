using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace PortfolioMVC.Areas.Api.Controllers
{
    [Authorize]
    public class TestController : BaseApiController
    {
        public dynamic Index()
        {
            return new
            {
                A = 1
            };
        }
    }
}
