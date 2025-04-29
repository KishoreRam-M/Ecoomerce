package com.krm.Mini.Eccommerce.Service;

import com.krm.Mini.Eccommerce.Exception.ResourceNotFoundException;
import com.krm.Mini.Eccommerce.Model.Category;
import com.krm.Mini.Eccommerce.Repo.CategoryRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepo categoryRepo;

    public CategoryService(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    public List<Category> getALlCategory() {
        return categoryRepo.findAll();
    }

    public List<Category> getAllActiveCategory() {
        return categoryRepo.findByActiveTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));


    }

    @Transactional
    public Category createCategory(Category category) throws Exception {
        if (categoryRepo.existsByName(category.getName())) {
            throw new Exception("Category name Already Exist");
        }
        return categoryRepo.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepo.deleteById(id);
    }

    @Transactional
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setImageUrl(categoryDetails.getImageUrl());
        category.setActive(categoryDetails.isActive());
        category.setUpdatedAt(LocalDateTime.now());

        return categoryRepo.save(category);
    }

}
