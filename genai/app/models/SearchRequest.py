from pydantic import Field, BaseModel


class SearchRequest(BaseModel):
    query: str = Field(description="Name of ingredient")
    matches: int = Field(description="Number of matches")
