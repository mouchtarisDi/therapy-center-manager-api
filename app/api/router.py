from fastapi import APIRouter
from app.api.routes.auth import router as auth_router
from app.api.routes.centers import router as centers_router
from app.api.routes.memberships import router as memberships_router
from app.api.routes.students import router as students_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(centers_router)
api_router.include_router(memberships_router)
api_router.include_router(students_router)