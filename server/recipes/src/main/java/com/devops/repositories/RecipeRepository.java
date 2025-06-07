package com.devops.repositories;

import com.devops.entities.Recipe;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, String> {
    List<Recipe> findAllByUserId(String userId);

    void deleteById(String id);
}
