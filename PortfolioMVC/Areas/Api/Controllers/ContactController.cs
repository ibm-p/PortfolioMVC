using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PortfolioMVC.Data.Business;
using PortfolioMVC.Data.Entity;
using PortfolioMVC.Models;
using PortfolioMVC.Services;

namespace PortfolioMVC.Areas.Api.Controllers
{
    [Authorize]
    public class ContactController : BaseApiController
    {
        private ContactService _contactService;
        public ContactController(ContactService contactService)
        {
            _contactService = contactService;
        }
        public ObjectApiResult GetContacts()
        {
            var list = _contactService.GetContacts();
            return new ObjectApiResult()
            {
                Data = list,
                Success = true,
            };
        }
        [HttpPost]
        public ApiResult DeleteContact(int id)
        {
            _contactService.Remove<Contact>(id);
            var r = _contactService.SaveChanges();
            return ApiResult.Ok();
        }
    }
}
