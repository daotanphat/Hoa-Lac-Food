using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class FixRelationUserAndCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "34776de7-5b54-422a-a666-3558113e4b88");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "87555a63-442a-403e-af69-e5d0eeb2289e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "930b25dd-3daa-41eb-8d3a-1cb1e8f749c8");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<int>(
                name: "CreatedBy",
                table: "Categories",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "34776de7-5b54-422a-a666-3558113e4b88", null, "Customer", "CUSTOMER" },
                    { "87555a63-442a-403e-af69-e5d0eeb2289e", null, "Shop", "SHOP" },
                    { "930b25dd-3daa-41eb-8d3a-1cb1e8f749c8", null, "Admin", "ADMIN" }
                });
        }
    }
}
