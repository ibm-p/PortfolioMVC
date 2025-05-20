using Microsoft.EntityFrameworkCore;
using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Business
{
    public class ServiceService : BaseService
    {
        public ServiceService(PDbContext _context)
        {
            this.SetContext(_context);
        }
        public IQueryable<Service> GetAll()
        {
            return this.Context.Service
                .OrderByDescending(m => m.Date);
        }
        public void AddOrUpdate(Service service)
        {
            this.Context.Service.Update(service);
        }
    }
}
