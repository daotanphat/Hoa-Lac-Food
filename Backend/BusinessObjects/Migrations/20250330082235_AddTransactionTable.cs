using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    gateway = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    transaction_date = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "'0000-00-00 00:00:00'"),
                    account_number = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    sub_account = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    amount_in = table.Column<decimal>(type: "decimal(20,2)", nullable: false),
                    amount_out = table.Column<decimal>(type: "decimal(20,2)", nullable: false),
                    accumulated = table.Column<decimal>(type: "decimal(20,2)", nullable: false),
                    code = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    transaction_content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    reference_number = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "113d0b64-1750-4d5b-a10d-ddbe2f41ee4c", null, "Shop", "SHOP" },
                    { "2c3e95c4-cb51-45cf-a649-7eb6a64f61b0", null, "Admin", "ADMIN" },
                    { "8fae20ef-438e-407a-898c-c59eaef03ece", null, "Customer", "CUSTOMER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "113d0b64-1750-4d5b-a10d-ddbe2f41ee4c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2c3e95c4-cb51-45cf-a649-7eb6a64f61b0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8fae20ef-438e-407a-898c-c59eaef03ece");

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
    }
}
