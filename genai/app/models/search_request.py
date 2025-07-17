from pydantic import Field, BaseModel


class SearchRequest(BaseModel):
    query: str = Field(description="Search query")
    count: int = Field(description="Number of matches")
