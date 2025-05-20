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
    public class AboutController : BaseApiController
    {
        private AboutService _aboutService;
        private ImageService _imageService;
        public AboutController(ImageService imageService, AboutService aboutService)
        {
            _aboutService = aboutService;
            _imageService = imageService;
        }
        [HttpGet]
        public ApiResult<About?> GetAbout()
        {
            var result = new ApiResult<About?>();
            result.Data = _aboutService.GetAbout();
            return result;
        }
        [HttpPost]
        public ApiResult UpdateAbout([FromBody] About about)
        {
            if (!ModelState.IsValid)
            {
                return ApiResult.Fail(ModelState.GetModelErrors());
            }
            if (about.Id != 1)
            {
                return ApiResult.Fail("Geçersiz güncelleme işlemi");
            }
            var older = _aboutService.GetAbout()!;
            //Güncellerken hata vermemsi için detach ediyoruz.
            _aboutService.Detach(older);
            string fp = _imageService.SaveImage(about.LinkPicture);
            if (fp == ImageService.Invalid)
            {
                about.LinkPicture = older?.LinkPicture;
            }
            else
            {
                if (string.IsNullOrEmpty(older?.LinkPicture) == false)
                {
                    _imageService.DeleteImage(older.LinkPicture!);
                }
                about.LinkPicture = fp;

            }
            _aboutService.AddOrUpdate(about);
            int r = _aboutService.SaveChanges();
            return ApiResult.Ok();
        }

        [HttpGet]
        public ApiResult<List<Reference>> GetReferences()
        {
            var references = _aboutService.GetReferences().ToList();
            return new ApiResult<List<Reference>>()
            {
                Success = true,
                Data = references
            };
        }

        [HttpPost]
        public ApiResult AddOrUpdateReference([FromBody] Reference reference)
        {
            if (!ModelState.IsValid)
            {
                return ApiResult.Fail(ModelState.GetModelErrors());
            }
            var older = _aboutService.GetReferenceById(reference.Id);
            if (older != null)
            {
                //Güncellerken hata vermemsi için detach ediyoruz.
                _aboutService.Detach(older);
            }
            string fp = _imageService.SaveImage(reference.LinkPicture);
            if (fp == ImageService.Invalid)
            {
                reference.LinkPicture = older?.LinkPicture ?? string.Empty;
            }
            else
            {
                if (string.IsNullOrEmpty(older?.LinkPicture) == false)
                {
                    _imageService.DeleteImage(older.LinkPicture!);
                }
                reference.LinkPicture = fp;

            }
            _aboutService.AddOrUpdate(reference);
            int r = _aboutService.SaveChanges();
            return ApiResult.Ok();
        }
        [HttpPost]
        public ApiResult DeleteReference(int id)
        {
            var older = _aboutService.GetReferenceById(id);
            if (older == null)
                return ApiResult.Fail("Kayıt bulunamadı");

            _aboutService.Remove(older!);
            var r = _aboutService.SaveChanges();
            if (string.IsNullOrEmpty(older?.LinkPicture) == false)
            {
                _imageService.DeleteImage(older.LinkPicture!);
            }
            return ApiResult.Ok();
        }
    }
}
