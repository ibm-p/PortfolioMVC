using System.ComponentModel.DataAnnotations;

namespace PortfolioMVC.Data.Entity
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Classname { get; set; } = null!;

        public DateTimeOffset Date { get; set; } = DateTimeOffset.Now;
        public virtual ICollection<Portfolio> Portfolios { get; set; } = new HashSet<Portfolio>();
    }
}
