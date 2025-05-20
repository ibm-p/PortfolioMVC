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
    public class PortfolioController : BaseApiController
    {
        private PortfolioService _portfolioService;
        private ImageService _imageService;
        public PortfolioController(PortfolioService portfolioService, ImageService imageService)
        {
            _portfolioService = portfolioService;
            _imageService = imageService;
        }
        [HttpGet]
        public ApiResult<List<Category>> GetCategories()
        {
            var result =new ApiResult<List<Category>>();
            result.Data = _portfolioService.GetCategories().ToList();
            return result;
        }
        [HttpGet]
        public ApiResult<List<Portfolio>> GetAll()
        {
            var result = new ApiResult<List<Portfolio>>();
            result.Data = _portfolioService.GetAll().ToList();
            return result;
        }
        [HttpPost]
        public ApiResult AddOrUpdateCategory([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return ApiResult.Fail(ModelState.GetModelErrors());
            }
            _portfolioService.AddOrUpdate(category);
            int r = _portfolioService.SaveChanges();
            return ApiResult.Ok();
        }
        [HttpPost]
        public ApiResult AddOrUpdatePortfolio([FromBody] Portfolio portfolio)
        {
            if (!ModelState.IsValid)
            {
                return ApiResult.Fail(ModelState.GetModelErrors());
            }
            var older = _portfolioService.GetById(portfolio.Id);
            if(older != null)
            {
                //Güncellerken hata vermemsi için detach ediyoruz.
                _portfolioService.Detach(older);
            }
            portfolio.Category = null;
            //0 ataması hata vereceği için null atıyoruz.
            if (portfolio.CategoryId == 0)
                portfolio.CategoryId = null;
            string fp = _imageService.SaveImage(portfolio.ImageLink);
            if (fp == ImageService.Invalid)
            {
                portfolio.ImageLink = older?.ImageLink ?? string.Empty;
            }
            else
            {
                if (string.IsNullOrEmpty(older?.ImageLink) == false)
                {
                    _imageService.DeleteImage(older.ImageLink!);
                }
                portfolio.ImageLink = fp;

            }
            _portfolioService.AddOrUpdatePortfolio(portfolio);
            int r = _portfolioService.SaveChanges();
            return ApiResult.Ok();
        }
        [HttpPost]
        public ApiResult DeleteCategory(int id)
        {
            _portfolioService.Remove<Category>(id);
            var r = _portfolioService.SaveChanges();
            return ApiResult.Ok();
        }

        [HttpPost]
        public ApiResult DeletePortfolio(int id)
        {
            var older = _portfolioService.GetById(id);
            if (older == null)
                return ApiResult.Fail("Kayıt bulunamadı");

            _portfolioService.Remove(older!);
            var r = _portfolioService.SaveChanges();
            if (string.IsNullOrEmpty(older?.ImageLink) == false)
            {
                _imageService.DeleteImage(older.ImageLink!);
            }
            return ApiResult.Ok();
        }
    }
}
