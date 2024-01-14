from pydantic import BaseModel


class InstantResults(BaseModel):
    abstract: str
    abstract_text: str
    related_topics: list[str]
