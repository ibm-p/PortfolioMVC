using PortfolioMVC.Data.Entity;

namespace PortfolioMVC.Models
{
    public class PortfolioModel
    {
        public List<Category> Categories { get; set; } = new List<Category>();
        public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
    }
}
