# UMLs

## Top-Level Architecture

![architecture](./UMLClassDiagram.svg)
*UML component diagram of top-level architecture*

### Server
#### Recipes

This is the single contact point for the frontend. It manages all recipe-related operations and reaches out to the other two services when it comes to generating recipes or storing them. In addition, it keeps track of the ingredients a recipe contains and their nutritional values.

#### Suggestions

This is the service that talks to the AI-service. It will mainly be used to parse inputs in a digestible way for that service

#### Users

This is the service that manages users. Nothing fancy will transpire here, just mere user registration and login. Passwords will be saved hashed. Maybe a JWT will be enforced per request, maybe not, it is to be decided.

#### Database

We decided to go for PostgreSQL. It has great community support, as well as a huge database of plugins, such as pg-vector, which facilitates RAG.

### AI

#### Django Webserver

Rest entry point for the AI service.
It will be responsible for exposing an API to the other services and managing the connection to the vector database.
Internally embeddings will be generated using LangChain through the OpenAI-Api.
The same goes for the prompts. Both subject to change depending on the resources provided by the lecture.


#### PGVector DB

Vector database to store recipe embeddings. Hosting depends on lecture (s3 direct or in container on vm).

## Analysis Object Model (AOM)

![aom-class-diagramm](./AOMClassDiagram.svg)
*UML class diagram of AOM (Server + GenAI)*

## Use-Cases

![uc](./uc.png)
*UML use case diagram of main use cases*

