using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class SeedRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3fd54b57-4d07-4fe6-9e45-7380219e0c0f", null, "Admin", "ADMIN" },
                    { "7efebaab-2554-4cbb-89fb-52153d1c7c32", null, "Customer", "CUSTOMER" },
                    { "ce190c80-b45f-4090-b483-0ab389e56c50", null, "Shop", "SHOP" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3fd54b57-4d07-4fe6-9e45-7380219e0c0f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7efebaab-2554-4cbb-89fb-52153d1c7c32");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ce190c80-b45f-4090-b483-0ab389e56c50");
        }
    }
}
