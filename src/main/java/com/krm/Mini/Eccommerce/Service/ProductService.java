package com.krm.Mini.Eccommerce.Service;

import com.krm.Mini.Eccommerce.Exception.ResourceNotFoundException;
import com.krm.Mini.Eccommerce.Model.Category;
import com.krm.Mini.Eccommerce.Model.Product;
import com.krm.Mini.Eccommerce.Repo.CategoryRepo;
import com.krm.Mini.Eccommerce.Repo.ProductRepo;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;

    public ProductService(ProductRepo productRepo, CategoryRepo categoryRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }


    public Product getProductByID(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getActiveProducts() {
        return productRepo.findByActiveTrue();
    }

    public Page<Product> getProductsByCategoryId(Long categoryId, Pageable pageable) {
        return productRepo.findByCategoryId(categoryId, pageable);
    }

    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return productRepo.searchProducts(keyword, pageable);
    }

    Page<Product> findByPriceRange(Double minPrice, Double maxPrice, Pageable pageable) {
        return productRepo.findByPriceRange(minPrice, maxPrice, pageable);
    }

    List<Product> getFeaturedProduct() {
        return productRepo.findByFeaturedTrue();
    }

    @Transactional
    public Product createProduct(Product product, Long ID) {
        Category category = categoryRepo.findById(ID)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + ID));
        product.setCategory(category);
        return productRepo.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductByID(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setFeatured(productDetails.isFeatured());
        product.setActive(productDetails.isActive());
        product.setSku(productDetails.getSku());
        product.setUpdatedAt(LocalDateTime.now());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepo.findById(productDetails.getCategory().getId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDetails.getCategory().getId()));
            product.setCategory(category);
        }

        return productRepo.save(product);

    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductByID(id);
        productRepo.delete(product);
    }


}
