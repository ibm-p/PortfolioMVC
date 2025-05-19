using System.ComponentModel.DataAnnotations;

namespace PortfolioMVC.Data.Entity
{
    public class Contact
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz.")]
        public string Email { get; set; } = null!;
        [Required]
        public string Subject { get; set; } = null!;
        public string? Message { get; set; }
        public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;


    }
}
