using System.ComponentModel.DataAnnotations;

namespace PortfolioMVC.Data.Entity
{
    public class Service
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = null!;
        [Required]

        public string IconClass { get; set; } = null!;
        public DateTimeOffset Date { get; set; } = DateTimeOffset.Now;
    }
}
