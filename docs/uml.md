# UMLs

## Architecture

![architecture](./UMLClassDiagram.svg)

## Use-Cases

```plantuml
@startuml
actor User

package "Phone Scenario" {
  usecase "Take Picture of Ingredients" as TakePic
  usecase "Upload Picture of Ingredients" as UploadPic
  usecase "Get Recipes from Picture" as GetRecipesFromPic
}

package "Desktop Scenario" {
  usecase "Input Ingredients Manually" as ManualInput
  usecase "Manage Past Recipes" as ManageRecipes
  usecase "Add Items to Shopping List" as ShoppingList
  usecase "Check Nutritional Values" as NutritionCheck
}

usecase "View AI-Generated Recipes" as ViewRecipes
usecase "Save Recipe" as SaveRecipe
usecase "Alter Recipe" as AlterRecipe

User --> TakePic
User --> UploadPic
TakePic --> GetRecipesFromPic
UploadPic --> GetRecipesFromPic
GetRecipesFromPic --> ViewRecipes

User --> ManualInput
ManualInput --> ViewRecipes

User --> ViewRecipes
User --> SaveRecipe
User --> AlterRecipe

User --> ManageRecipes
User --> ShoppingList
User --> NutritionCheck
@enduml
```

## Frontend

TODO: think about the feasibility of even defining multiple services here! Maybe we won't need them!

## Backend

```plantuml
@startuml
skinparam classAttributeIconSize 0

' ========== Entities ==========
class User {
  - id: UUID
  - name: String
  - email: String
  - passwordHash: String
  + getSavedRecipes(): List<Recipe>
  + addToShoppingList(item: Ingredient)
}

class Recipe {
  - id: UUID
  - title: String
  - instructions: String
  - ingredients: List<Ingredient>
  + updateIngredients(List<Ingredient>)
}

class Ingredient {
  - id: UUID
  - name: String
  - quantity: String
  - calories: float
  + getNutritionalInfo(): NutritionalData
}

class NutritionalData {
  - calories: float
  - protein: float
  - fat: float
  - carbs: float
}

class Image {
  - id: UUID
  - url: String
  - uploadedAt: DateTime
  - processed: Boolean
}

' ========== Services ==========

class RecipeAIService {
  + generateRecipesFromImage(image: Image): List<Recipe>
  + generateRecipesFromIngredients(List<Ingredient>): List<Recipe>
}

' ========== Controllers ==========

class RecipeController {
  + getRecipeById(id: UUID): Recipe
  + saveRecipe(userId: UUID, recipe: Recipe)
  + alterRecipe(userId: UUID, recipe: Recipe)
}

class ImageUploadController {
  + uploadImage(imageFile): Image
  + getProcessedRecipes(imageId: UUID): List<Recipe>
}

class UserController {
  + login(email: String, password: String)
  + register(name: String, email: String, password: String)
}

' ========== Relationships ==========

User "1" -- "0..*" Recipe : saves >
User "1" -- "0..*" Ingredient : has shopping list >
Recipe "1" -- "1..*" Ingredient
Ingredient "1" -- "1" NutritionalData
ImageUploadController --> RecipeAIService
RecipeController --> RecipeAIService

@enduml
```

### Recipes

This is the single contact point for the frontend. It manages all recipe-related operations and reaches out to the other two services when it comes to generating recipes or storing them. In addition, it keeps track of the ingredients a recipe contains and their nutritional values.

### Suggestions

This is the service that talks to the AI-service. It will mainly be used to parse inputs in a digestible way for that service

### Users

This is the service that manages users. Nothing fancy will transpire here, just mere user registration and login. Passwords will be saved hashed. Maybe a JWT will be enforced per request, maybe not, it is to be decided.

## Database

We decided to go for PostgreSQL. It has great community support, as well as a huge database of plugins, such as pg-vector, which facilitates RAG.

## AI

```mermaid
architecture-beta
    group backend(cloud)[AIService]

    service webserver(server)[Django Webserver] in backend
    service vectordb(database)[PGVector DB] in backend

    webserver:R -- L:vectordb
```

## Django Webserver

Rest entry point for the AI service. 
It will be responsible for exposing an API to the other services and managing the connection to the vector database.
Internally embeddings will be generated using LangChain through the OpenAI-Api.
The same goes for the prompts. Both subject to change depending on the resources provided by the lecture.


## PGVector DB

Vector database to store recipe embeddings. Hosting depends on lecture (s3 direct or in container on vm). 
