using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioMVC.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "About",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "About",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WebSite",
                table: "About",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Age", "City", "WebSite" },
                values: new object[] { 0, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "About");

            migrationBuilder.DropColumn(
                name: "City",
                table: "About");

            migrationBuilder.DropColumn(
                name: "WebSite",
                table: "About");
        }
    }
}
