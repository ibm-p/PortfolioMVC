using System.ComponentModel.DataAnnotations;

namespace PortfolioMVC.Data.Entity
{
    public class Reference
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]

        public string? LinkPicture { get; set; } = string.Empty;
        public string? Title { get; set; }
        [Required]
        public string Description { get; set; } = null!;

        public DateTimeOffset Date { get; set; } = DateTimeOffset.Now;

    }
}
