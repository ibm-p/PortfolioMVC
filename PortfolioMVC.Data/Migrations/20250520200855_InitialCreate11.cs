using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioMVC.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "About",
                columns: new[] { "Id", "Description", "LinkPicture" },
                values: new object[] { 1, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "About",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
