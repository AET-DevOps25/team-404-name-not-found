# API Design Outline

---

## Server Endpoints

### Users Service (`:8080`)

- **POST** `/api/users/login`  
  **Request:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```  
  **Response (200):**
  ```json
  {
    "token": "jwt-token"
  }
  ```

- **POST** `/api/users/register`  
  **Request:**
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "pass": "password123",
    "role": "user"
  }
  ```  
  **Response (200):** No content, Successfully registered   
  **Response (409):** No content, Email already registered


- **GET** `/api/whoami`  
  **Headers:**  
  `Authorization: Bearer <token>`  
  **Response:**
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe" // TODO: currently not implemented
  }
  ```

---

### Recipes Service (`:8081`)

> **Note:** CRUD support for recipes and ingredients TBD.

- **[CRUD]** `/api/recipes`
- **[CRUD]** `/api/recipes/ingredients`
- **GET** `/api/recipes`  
  (Potential listing of recipes)

---

### Ingredients Service (`:8082`)

- **TODO:** Add support for nutrition data, etc.

---

## GenAI Endpoints

- **POST** `/api/recipe/matching`
    - Returns only recipes that match the provided ingredients.

- **POST** `/api/recipe/exploratory`
    - Returns creative recipes that may include additional ingredients.
        - New ingredients will be automatically added to the shopping cart.

- **GET** `/api/search/recipe`
    - Searches generated recipes using RAG over their descriptions.

- **Example Request Body:**
  ```json
  {
    "ingredients": [
      {
        "name": "Tomato",
        "amount": 2,
        "unit": "pieces"
      }
    ]
  }
  ```

- **Example Response:**
  ```json
  {
    "recipes": [
      {
        "title": "Tomato Pasta",
        "description": "A simple tomato-based pasta recipe.",
        "difficulty": "EASY",
        "cook_time": 30,
        "ingredients": [...],
        "needed_ingredients": [...],
        "steps": [
          "Boil pasta",
          "Prepare sauce",
          "Mix and serve"
        ]
      }
    ]
  }
  ```

### Recipe Data Model

```json
{
    "title": "string",
    "description": "string",
    "difficulty": "EASY | MEDIUM | ADVANCED",
    "cook_time": "int (minutes)",
    "ingredients": [
        ingredient
    ],
    "needed_ingredients": [
        ingredient
    ],
    "steps": [
        "string"
    ]
}
```

### Ingredient Model

```json
{
    "name": "string",
    "amount": "int",
    "unit": "string"
}
```
