package com.devops.controller;

import com.devops.dto.RecipeDTO;
import com.devops.service.ImagesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@Tag(name = "Images", description = "Image analysis and recipe generation")
public class ImagesController {

    @Autowired
    private ImagesService imagesService;

    @Value("${vars.mode}")
    private String mode;

    @Operation(summary = "Analyze fridge image and return recipes", description = "Accepts a fridge photo as a file and returns a list of generated recipes based on identified ingredients.", requestBody = @RequestBody(content = @Content(mediaType = "multipart/form-data", schema = @Schema(type = "object", requiredProperties = {
        "file", "numRecipes"}))), responses = {
        @ApiResponse(responseCode = "200", description = "List of recipes generated from the image"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/recipes/match")
    public ResponseEntity<List<RecipeDTO>> analyzeImage(
        @Parameter(description = "Image file of the fridge", required = true, content = @Content(mediaType = "multipart/form-data", schema = @Schema(type = "string", format = "binary"))) @RequestParam("file") MultipartFile file,

        @Parameter(description = "Number of recipes to return", required = true, example = "3", schema = @Schema(type = "integer", format = "int32")) @RequestParam("numRecipes") int numRecipes,
        @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);
        return ResponseEntity.ok(imagesService.analyzeAndFetchRecipes(file, numRecipes, userId, "/match/"));
    }

    @Operation(summary = "Analyze fridge image and return recipes with a creative twist", description = "Accepts a fridge photo as a file and returns a list of generated recipes based on identified ingredients.", requestBody = @RequestBody(content = @Content(mediaType = "multipart/form-data", schema = @Schema(type = "object", requiredProperties = {
        "file", "numRecipes"}))), responses = {
        @ApiResponse(responseCode = "200", description = "List of recipes generated from the image"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/recipes/explore")
    public ResponseEntity<List<RecipeDTO>> checkImage(
        @Parameter(description = "Image file of the fridge", required = true, content = @Content(mediaType = "multipart/form-data", schema = @Schema(type = "string", format = "binary"))) @RequestParam("file") MultipartFile file,

        @Parameter(description = "Number of recipes to return", required = true, example = "3", schema = @Schema(type = "integer", format = "int32")) @RequestParam("numRecipes") int numRecipes,
        @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);
        return ResponseEntity.ok(imagesService.analyzeAndFetchRecipes(file, numRecipes, userId, "/explore/"));
    }

    private String configureUserId(String userId) {
        String result = userId;
        if (mode.equalsIgnoreCase("dev")) {
            result = Optional.ofNullable(userId).orElse("dev-user");
        }
        if (result == null || result.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "The proxy should have set the user id in the X-User-Id header");
        }
        return userId;
    }
}
