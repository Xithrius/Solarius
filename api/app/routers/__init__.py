from fastapi import APIRouter

from .monitoring import router as monitor_router
from .search import router as search_router

api_router = APIRouter(prefix="/api")

api_router.include_router(monitor_router, prefix="/monitor")
api_router.include_router(search_router, prefix="/search")
