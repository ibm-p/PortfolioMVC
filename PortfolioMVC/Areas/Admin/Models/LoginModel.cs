using System.ComponentModel.DataAnnotations;
namespace PortfolioMVC.Areas.Admin.Models
{

    public class LoginModel
    {
        [Required]
        [Display(Name = "Kullanıcı")]
        public string Username { get; set; } = null!;

        [Required]
        [Display(Name = "Şifre")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
    }

}
