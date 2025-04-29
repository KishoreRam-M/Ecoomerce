package com.krm.Mini.Eccommerce.Repo;

import com.krm.Mini.Eccommerce.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    List<Category> findByActiveTrue();
    boolean existsByName(String name);
}
