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
    public class PersonalController : BaseApiController
    {
        private PersonalService _personalService;
        private ImageService _imageService;
        public PersonalController(PersonalService personalService, ImageService imageService)
        {
            _personalService = personalService;
            _imageService = imageService;
        }
        [HttpGet]
        public ApiResult<Personal?> GetPersonal()
        {
            var result = new ApiResult<Personal?>();
            result.Data = _personalService.GetPersonal();
            return result;
        }
        [HttpPost]
        public ApiResult UpdatePersonal([FromBody] Personal personal)
        {
            if (!ModelState.IsValid)
            {
                return ApiResult.Fail(ModelState.GetModelErrors());
            }
            if (personal.Id != 1)
            {
                return ApiResult.Fail("Geçersiz güncelleme işlemi");
            }
            var older = _personalService.GetPersonal()!;
            //Güncellerken hata vermemsi için detach ediyoruz.
            _personalService.Detach(older);
            string fp = _imageService.SaveImage(personal.LinkPicture);
            if (fp == ImageService.Invalid)
            {
                personal.LinkPicture = older?.LinkPicture;
            }
            else
            {
                if (string.IsNullOrEmpty(older?.LinkPicture) == false)
                {
                    _imageService.DeleteImage(personal.LinkPicture!);
                }
                personal.LinkPicture = fp;

            }
            _personalService.AddOrUpdate(personal);
            int r = _personalService.SaveChanges();
            return ApiResult.Ok();
        }
    }
}
