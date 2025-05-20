using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Business
{
    public class AboutService : BaseService
    {
        public AboutService(PDbContext _context)
        {
            this.SetContext(_context);
        }
        public About? GetAbout()
        {
            return GetAbout(1);
        }
        public About? GetAbout(int id)
        {
            return Context.About.Where(f => f.Id == id).FirstOrDefault();
        }
        public IQueryable<Reference> GetReferences()
        {
            return Context.Reference.OrderByDescending(m => m.Date);
        }
        public Reference? GetReferenceById(int id) => Context.Reference.Find(id);
    }
}
