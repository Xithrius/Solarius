from os import getenv
from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, status
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.dependencies import get_db_session

from .schemas import DuckDuckGoInstantResults, GoogleSearchResult, SummarizedResult
from .utils import summarize_search_snippets

router = APIRouter()

DUCKDUCKGO_API_BASE_URL = "https://api.duckduckgo.com/"
GOOGLE_API_CUSTOM_SEARCH_URL = "https://www.googleapis.com/customsearch/v1"

GOOGLE_API_KEY = getenv("GOOGLE_API_KEY")
GOOGLE_API_CSE_ID = getenv("GOOGLE_API_CSE_ID")


@router.get(
    "/duckduckgo",
    status_code=status.HTTP_200_OK,
    response_model=DuckDuckGoInstantResults,
    response_description="DuckDuckGo instant search results",
)
async def duckduckgo_instant_answers(
    session: Annotated[AsyncSession, Depends(get_db_session)],
    query: str,
) -> DuckDuckGoInstantResults:
    response = httpx.get(
        DUCKDUCKGO_API_BASE_URL,
        params={"q": query, "format": "json"},
    )
    response.raise_for_status()
    data = response.json()

    instant_results = DuckDuckGoInstantResults(
        abstract=data["Abstract"],
        abstract_text=data["AbstractText"],
        related_topics=[search_result["Text"] for search_result in data["RelatedTopics"]],
    )

    return instant_results


@router.get(
    "/google",
    status_code=status.HTTP_200_OK,
    response_model=SummarizedResult,
    response_description="Search results from Google",
)
async def google_search(
    session: Annotated[AsyncSession, Depends(get_db_session)],
    query: str,
) -> SummarizedResult:
    params = {
        "q": query,
        "cx": GOOGLE_API_CSE_ID,
        "key": GOOGLE_API_KEY,
    }

    response = httpx.get(GOOGLE_API_CUSTOM_SEARCH_URL, params=params)

    data = response.json()

    results = [GoogleSearchResult(**x) for x in data["items"]]

    combined_result = " ".join(x.snippet for x in results)

    summarized_result = await run_in_threadpool(summarize_search_snippets, combined_result)

    return {"output": summarized_result}
