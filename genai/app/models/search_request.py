from pydantic import Field, BaseModel


class SearchRequest(BaseModel):
    query: str = Field(description="Search query")
    matches: int = Field(description="Number of matches")
