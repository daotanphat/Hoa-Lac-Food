using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderEnums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "720cddc9-d8c1-4988-a935-ad02ec2a25d5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "752366da-96a8-4ad2-8dd3-fa157b65e6a9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ea6dd74d-9d0d-42cb-bea0-33f4f4b1f63b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "79604791-6646-4140-806d-876c4f664822", null, "Shop", "SHOP" },
                    { "b4a498ff-5dd2-4b6b-b7d0-37b243d1f2df", null, "Admin", "ADMIN" },
                    { "dfd7759d-e5ef-4164-82b5-e7ca1795f64b", null, "Customer", "CUSTOMER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "79604791-6646-4140-806d-876c4f664822");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b4a498ff-5dd2-4b6b-b7d0-37b243d1f2df");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dfd7759d-e5ef-4164-82b5-e7ca1795f64b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "720cddc9-d8c1-4988-a935-ad02ec2a25d5", null, "Customer", "CUSTOMER" },
                    { "752366da-96a8-4ad2-8dd3-fa157b65e6a9", null, "Shop", "SHOP" },
                    { "ea6dd74d-9d0d-42cb-bea0-33f4f4b1f63b", null, "Admin", "ADMIN" }
                });
        }
    }
}
