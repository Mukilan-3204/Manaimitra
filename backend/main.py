from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import FRONTEND_URL
from routes import divisions, plots, admin, users

app = FastAPI(
    title="Manai Mitra API",
    description="Real Estate Platform for Madurai District",
    version="1.0.0"
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(divisions.router)
app.include_router(plots.router)
app.include_router(admin.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "Manai Mitra API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
