using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Business
{
    public class PersonalService : BaseService
    {
        public PersonalService(PDbContext _context)
        {
                this.SetContext(_context);
        }
        public Personal? GetPersonal()
        {
            return GetPersonal(1);
        }
        public Personal? GetPersonal(int id) {
            return Context.Personel.Where(f => f.Id == id).FirstOrDefault();    
        }
    }
}
