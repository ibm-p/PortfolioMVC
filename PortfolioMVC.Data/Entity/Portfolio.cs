using System.ComponentModel.DataAnnotations;

namespace PortfolioMVC.Data.Entity
{
    public class Portfolio
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Description { get; set; } = null!;
        [Required]
        public string ImageLink { get; set; } = null!;
        public DateTimeOffset Date { get; set; } = DateTimeOffset.Now;
        public int? CategoryId { get; set; }
        public virtual Category? Category { get; set; }

    }
}
