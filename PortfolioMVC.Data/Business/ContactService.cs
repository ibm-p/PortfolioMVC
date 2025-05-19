using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Business
{
    public class ContactService : BaseService
    {
        public ContactService(PDbContext _context)
        {
            this.SetContext(_context);
        }
        public void AddOrUpdate(Contact contact) {
            contact.Date = DateTimeOffset.Now;
            Context.Update(contact);
        }
        public IQueryable<Contact> GetContacts() {
            return Context.Contact.OrderByDescending(c => c.Date);
        }
    }
}
