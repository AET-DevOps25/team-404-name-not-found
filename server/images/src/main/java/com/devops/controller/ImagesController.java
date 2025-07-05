package com.devops.controller;

import com.devops.dto.Recipe;
import com.devops.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ImagesController {

    @Autowired
    private ImagesService imagesService;

    @PostMapping("/analyze")
    public ResponseEntity<List<Recipe>> analyzeImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("numRecipes") int numRecipes) {
        return ResponseEntity.ok(imagesService.analyzeAndFetchRecipes(file, numRecipes));
    }
}
