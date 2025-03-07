﻿using BusinessObjects;
using FoodDeliveryAPI.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Repository
{
	public class CategoryRepository
	{
		private readonly ApplicationDBContext _context;
		public CategoryRepository(ApplicationDBContext context)
		{
			_context = context;
		}

		public async Task<bool> IsCategoryExist(int categoryId)
		{
			return await _context.Categories.AnyAsync(c => c.Id == categoryId);
		}

		public async Task<bool> IsCategoryExist(string categoryName)
		{
			return await _context.Categories.AnyAsync(c => c.Name == categoryName);
		}

		public async Task<Category> CreateCategoryAsync(Category category)
		{
			try
			{
				await _context.Categories.AddAsync(category);
				await _context.SaveChangesAsync();
				return category;
			}
			catch (Exception ex)
			{
				throw new InvalidOperationException(ex.Message);
			}
		}

		public async Task<List<Category>> GetAllCategoriesAsync()
		{
			return await _context.Categories
				.Include(c => c.CreatedUser)
				.ToListAsync();
		}

		public async Task<Category> GetCategoryByIdAsync(int id)
		{
			var category = await _context.Categories
				.Include(c => c.CreatedUser)
				.FirstOrDefaultAsync(c => c.Id == id);
			if (category == null) throw new EntityNotFoundException("Category not found!");
			return category;
		}

		public async Task<Category> UpdateCategoryAsync(Category category)
		{
			try
			{
				_context.Categories.Update(category);
				await _context.SaveChangesAsync();

				return category;
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
		}

		public async Task DeleteCategoryAsync(Category category)
		{
			try
			{
				_context.Categories.Remove(category);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
		}

		public async Task<bool> IsCategoryHasFood(int id)
		{
			return await _context.Foods
				.Include(f => f.Category)
				.AnyAsync(f => f.CategoryId == id);
		}
	}
}
