from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.dependencies import get_db_session

from .schemas import InstantResults

router = APIRouter()

DUCKDUCKGO_API_BASE_URL = "https://api.duckduckgo.com/"


@router.get(
    "/",
    response_model=InstantResults,
    status_code=status.HTTP_200_OK,
    response_description="Descriptions of an instant search",
)
async def get_some_results(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> InstantResults:
    response = httpx.get(
        DUCKDUCKGO_API_BASE_URL,
        params={"q": "openai", "format": "json"},
    )
    response.raise_for_status()
    data = response.json()

    instant_results = InstantResults(
        abstract=data["Abstract"],
        abstract_text=data["AbstractText"],
        related_topics=[search_result["Text"] for search_result in data["RelatedTopics"]],
    )

    return instant_results
