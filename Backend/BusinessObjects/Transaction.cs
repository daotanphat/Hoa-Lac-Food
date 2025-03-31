using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects
{
	public class Transaction
	{
		[Key]
		[Column("id")]
		public int Id { get; set; }

		[Required]
		[Column("gateway")]
		[StringLength(100)]
		public string Gateway { get; set; }

		[Required]
		[Column("transaction_date")]
		public DateTime TransactionDate { get; set; }

		[Column("account_number")]
		[StringLength(100)]
		public string AccountNumber { get; set; }

		[Column("sub_account")]
		[StringLength(250)]
		public string SubAccount { get; set; }

		[Required]
		[Column("amount_in", TypeName = "decimal(20,2)")]
		public decimal AmountIn { get; set; } = 0.00m;

		[Required]
		[Column("amount_out", TypeName = "decimal(20,2)")]
		public decimal AmountOut { get; set; } = 0.00m;

		[Required]
		[Column("accumulated", TypeName = "decimal(20,2)")]
		public decimal Accumulated { get; set; } = 0.00m;

		[Column("code")]
		[StringLength(250)]
		public string Code { get; set; }

		[Column("transaction_content")]
		public string TransactionContent { get; set; }

		[Column("reference_number")]
		[StringLength(255)]
		public string ReferenceNumber { get; set; }

		[Column("body")]
		public string Body { get; set; }

		[Required]
		[Column("created_at")]
		public DateTime CreatedAt { get; set; } = DateTime.Now;
	}
}
