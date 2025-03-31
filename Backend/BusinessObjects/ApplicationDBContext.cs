using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
	public class ApplicationDBContext : IdentityDbContext<AppUser>
	{
		public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions) : base(dbContextOptions)
		{

		}

		public DbSet<Shop> Shops { get; set; }
		public DbSet<Food> Foods { get; set; }
		public DbSet<Category> Categories { get; set; }
		public DbSet<Order> Orders { get; set; }
		public DbSet<OrderItem> OrderItems { get; set; }
		public DbSet<Cart> Carts { get; set; }
		public DbSet<CartItem> CartItems { get; set; }
		public DbSet<Transaction> Transactions { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			var builder = new ConfigurationBuilder()
							   .SetBasePath(Directory.GetCurrentDirectory())
							   .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
			IConfigurationRoot configuration = builder.Build();
			optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
		}

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			List<IdentityRole> roles = new List<IdentityRole>
			{
				new IdentityRole
				{
					Name = "Admin",
					NormalizedName = "ADMIN"
				},
				new IdentityRole
				{
					Name = "Shop",
					NormalizedName = "SHOP"
				},
				new IdentityRole
				{
					Name = "Customer",
					NormalizedName = "CUSTOMER"
				}
			};

			builder.Entity<AppUser>()
				.Property(a => a.Image)
				.HasColumnType("text");

			builder.Entity<Shop>()
				.Property(s => s.Image)
				.HasColumnType("text");

			builder.Entity<Food>()
				.Property(f => f.Image)
				.HasColumnType("text");

			builder.Entity<AppUser>()
				.HasMany(a => a.Orders)
				.WithOne(a => a.Customer)
				.HasForeignKey(a => a.CustomerId)
				.OnDelete(DeleteBehavior.SetNull);

			builder.Entity<AppUser>()
				.HasOne(a => a.Cart)
				.WithOne(a => a.Customer)
				.HasForeignKey<Cart>(a => a.CustomerId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Shop>()
				.HasMany(s => s.Users)
				.WithOne(s => s.Shop)
				.HasForeignKey(s => s.ShopId)
				.IsRequired(false);

			builder.Entity<Shop>()
				.HasMany(s => s.Orders)
				.WithOne(s => s.Shop)
				.HasForeignKey(s => s.ShopId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Shop>()
				.HasMany(s => s.Foods)
				.WithOne(s => s.Shop)
				.HasForeignKey(s => s.ShopId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Category>()
				.HasMany(c => c.Foods)
				.WithOne(c => c.Category)
				.HasForeignKey(c => c.CategoryId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Order>()
				.HasMany(o => o.OrderItems)
				.WithOne(o => o.Order)
				.HasForeignKey(o => o.OrderId)
				.IsRequired()
				.OnDelete(DeleteBehavior.NoAction);

			builder.Entity<Order>()
				.Property(o => o.PaymentStatus)
				.HasConversion<string>();

			builder.Entity<Order>()
				.Property(o => o.Status)
				.HasConversion<string>();

			builder.Entity<Cart>()
				.HasMany(c => c.CartItems)
				.WithOne(c => c.Cart)
				.HasForeignKey(c => c.CartId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Transaction>(entity =>
			{
				entity.Property(e => e.TransactionDate).HasDefaultValueSql("'0000-00-00 00:00:00'");
				entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
			});

			//builder.Entity<IdentityRole>().HasData(roles);
		}
	}
}
