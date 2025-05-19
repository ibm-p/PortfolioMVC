using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Business
{
    public class UserService : BaseService
    {
        public UserService(PDbContext _context)
        {
            this.SetContext(_context);
        }
        public User? GetUserByName(string name)
        {
            return Context.User.FirstOrDefault(f => f.Username == name);
        }
    }
}
