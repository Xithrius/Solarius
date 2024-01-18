from pydantic import BaseModel


class DuckDuckGoInstantResults(BaseModel):
    abstract: str
    abstract_text: str
    related_topics: list[str]


class GoogleSearchResult(BaseModel):
    title: str
    link: str
    displayLink: str  # noqa: N815
    snippet: str
