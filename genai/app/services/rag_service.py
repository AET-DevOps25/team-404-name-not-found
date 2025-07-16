import os

from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

from app.models.recipe import Recipe


class RagService:

    def __init__(self):
        embeddings_endpoint = os.getenv("EMBEDDINGS_ENDPOINT")
        print(f"Using embeddings endpoint: {embeddings_endpoint}")
        embeddings = OpenAIEmbeddings(
            model="tei",  # not checked by the server, any str is fine
            api_key="dummy",  # must be non-empty
            base_url=f"{embeddings_endpoint}/v1",
        )
        pg_vector_url = os.getenv("PG_VECTOR_URL")
        print(f"Using pg_vector url: {pg_vector_url}")
        self.vector_store = PGVector(
            connection=os.getenv("PG_VECTOR_URL"),
            collection_name="my_docs",
            embeddings=embeddings,
        )

    def add_recipe(self, recipe: Recipe):
        self.vector_store.add_documents([self.__recipe_to_document(recipe)])

    def find_recipes(self, searchstring: str, k: int = 3) -> list[str]:
        documents = self.vector_store.similarity_search(searchstring, k=k)
        return [str(document) for document in documents]

    @staticmethod
    def __recipe_to_document(recipe: Recipe) -> Document:
        return Document(
            page_content=(
                f"""Title: {recipe.title} "
                Description: {recipe.description} "
                Ingredients: {recipe.ingredients} \n {recipe.needed_ingredients} "
                Steps: {recipe.steps}"""
            ),
            metadata={
                "title": recipe.title,
                "difficulty": recipe.difficulty,
                "cook_time": recipe.cook_time,
            },
        )


# vector_store.add_documents(
#     [Document("Cats live near ponds", metadata={"topic": "animals"})]
# )
#
# print(vector_store.similarity_search("pond cats", k=2))
