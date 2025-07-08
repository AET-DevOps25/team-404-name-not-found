package com.devops.repositories;

import com.devops.entities.Ingredient;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, String> {
    List<Ingredient> findAllByUserId(String userId);

    void deleteById(String id);
}
