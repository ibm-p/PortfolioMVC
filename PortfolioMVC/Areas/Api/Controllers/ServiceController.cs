using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PortfolioMVC.Data.Business;
using PortfolioMVC.Data.Entity;
using PortfolioMVC.Extensions;
using PortfolioMVC.Models;
using PortfolioMVC.Services;

namespace PortfolioMVC.Areas.Api.Controllers
{
    [Authorize]
    public class ServiceController : BaseApiController
    {
        private ServiceService _serviceService;
        public ServiceController(ServiceService serviceService)
        {
            _serviceService = serviceService;
        }
        [HttpGet]
        public ApiResult<List<Service>> GetAll()
        {
            var result = new ApiResult<List<Service>>();
            result.Data = _serviceService.GetAll().ToList();
            return result;
        }
        [HttpPost]
        public ApiResult AddOrUpdate([FromBody] Service service)
        {
            if (!ModelState.IsValid)
            {
                return ApiResult.Fail(ModelState.GetModelErrors());
            }
            _serviceService.AddOrUpdate(service);
            int r = _serviceService.SaveChanges();
            return ApiResult.Ok();
        }

        [HttpPost]
        public ApiResult DeleteService(int id)
        {
            _serviceService.Remove<Service>(id);
            var r = _serviceService.SaveChanges();
            return ApiResult.Ok();
        }

    }
}
