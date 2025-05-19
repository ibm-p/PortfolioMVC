using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioMVC.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "AQAAAAIAAYagAAAAEA+YEr/b6bbfKfPeHfsYU9sJQHOmzRM5bxt2A1vifauJovyKD2XoS9lX69+V23efeA==", "PFAdmin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "AQAAAAIAAYagAAAAEK5koAIbcX/QmfWDOY5HjvcS+A8SVuKZggwt9Dd1ELjNy6XgYtGwT7xwwLeMtXz9XQ==", "admin" });
        }
    }
}
