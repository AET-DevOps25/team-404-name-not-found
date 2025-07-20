import logging
import os

from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

from app.models.recipe import Recipe
from app.models.recipes import Recipes

logger = logging.getLogger(__name__)


class RagService:

    def __init__(self):
        embeddings_endpoint = os.getenv("EMBEDDINGS_ENDPOINT")
        print(f"Using embeddings endpoint: {embeddings_endpoint}")
        embeddings = OpenAIEmbeddings(
            model="thenlper/gte-small",  # not checked by the server, any str is fine
            api_key="dummy",  # must be non-empty
            base_url=f"http://{embeddings_endpoint}/v1",
        )
        pg_vector_url = os.getenv("PG_VECTOR_URL")
        print(f"Using pg_vector url: {pg_vector_url}")
        self.vector_store = PGVector(
            connection=pg_vector_url,
            embeddings=embeddings,
            collection_name="docs",
        )

    def add_recipe(self, recipe: Recipe):
        self.vector_store.add_documents([self.__recipe_to_document(recipe)])

    def find_recipes(
        self, searchstring: str, k: int = 3, threshold: float = 0.0
    ) -> Recipes:
        try:
            documents = self.vector_store.similarity_search_with_score(
                searchstring, k=k
            )
        except Exception as e:
            logger.error(
                f"Error searching most likely no results -> GetTensorMutableData is null: {e}"
            )
            return Recipes(recipes=[])
        return Recipes(
            recipes=[
                Recipe.model_validate_json(document.metadata["recipe"])
                for document, score in documents
                if score >= threshold
            ]
        )

    @staticmethod
    def __recipe_to_document(recipe: Recipe) -> Document:
        return Document(
            # 1000 char limit (rag max is 512 token) assume 3 chars per token conservatively
            page_content=f"{recipe.title} + {recipe.description}"[:1000],
            metadata={"recipe": recipe.model_dump_json()},
        )
