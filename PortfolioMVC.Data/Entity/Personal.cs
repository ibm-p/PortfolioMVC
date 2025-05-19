namespace PortfolioMVC.Data.Entity
{
    public class Personal
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string NameSurname { get; set; } = null!;
        public string? LinkX { get; set; }
        public string? LinkFaceBook { get; set; }
        public string? LinkInstagram { get; set; }
        public string? LinkLinkedIn { get; set; }
        public string? Skills { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? LinkPicture { get; set; }

    }
}
