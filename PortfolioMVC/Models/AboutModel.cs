using PortfolioMVC.Data.Entity;

namespace PortfolioMVC.Models
{
    public class AboutModel
    {
        public List<Reference> References { get; set; } = new List<Reference>();
        public About About = null!;
        public Personal Personal = null!;
    }
}
