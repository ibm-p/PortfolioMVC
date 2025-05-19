using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioMVC.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkFaceBook",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkInstagram",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkLinkedIn",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkX",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameSurname",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "Personel",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Personel",
                columns: new[] { "Id", "Address", "Description", "Email", "LinkFaceBook", "LinkInstagram", "LinkLinkedIn", "LinkX", "NameSurname", "Phone", "Skills" },
                values: new object[] { 1, null, null, null, null, null, null, null, "Portfolio", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Personel",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "LinkFaceBook",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "LinkInstagram",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "LinkLinkedIn",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "LinkX",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "NameSurname",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Personel");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "Personel");
        }
    }
}
