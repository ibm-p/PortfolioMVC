using Microsoft.EntityFrameworkCore;
using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Business
{
    public class PortfolioService : BaseService
    {
        public PortfolioService(PDbContext _context)
        {
                this.SetContext(_context);
        }
        public Portfolio? GetById(int id) => this.Context.Portfolio.Find(id);
        public IQueryable<Category> GetCategories()
        {
            return this.Context.Category
                .OrderByDescending(m => m.Date);
        }
        public IQueryable<Portfolio> GetAll()
        {
            return this.Context.Portfolio
                .Include(f => f.Category)
                .OrderByDescending(m => m.Date);
        }
        public void AddOrUpdateCateogry(Category category)
        {
            this.Context.Category.Update(category);
        }
        public void AddOrUpdatePortfolio(Portfolio model)
        {
            this.Context.Portfolio.Update(model);
        }

    }
}
