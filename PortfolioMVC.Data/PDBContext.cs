using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PortfolioMVC.Data.Entity;
using PortfolioMVC.Data.Utils;

namespace PortfolioMVC.Data
{
    //Add-Migration InitialCreate11 -Project PortfolioMVC.Data -StartupProject PortfolioMVC
    //Update-Database -Project PortfolioMVC.Data -StartupProject PortfolioMVC komutu ile tablo güncellemesi yaptırılır.
    public class PDbContext : DbContext
    {
        public PDbContext(DbContextOptions<PDbContext> options) : base(options) {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "PFAdmin",
                    //Varsayılan Şifre: Pf123456 olarak belirlenmiştir.
                    PasswordHash = "AQAAAAIAAYagAAAAEA+YEr/b6bbfKfPeHfsYU9sJQHOmzRM5bxt2A1vifauJovyKD2XoS9lX69+V23efeA=="
                }
            );
            modelBuilder.Entity<Personal>().HasData(
                new Personal
                {
                    Id = 1,
                    NameSurname = "Portfolio",
                }
            );
            modelBuilder.Entity<About>().HasData(
                new About
                {
                    Id = 1,
                }
            );
        }
        public DbSet<Personal> Personel { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<Portfolio> Portfolio { get; set; }
        public DbSet<Reference> Reference { get; set; }
        public DbSet<About> About { get; set; }
        public DbSet<Service> Service { get; set; }
    }
}
