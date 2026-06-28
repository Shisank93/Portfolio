import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("project-aether-backend")

app = FastAPI(
    title="Project Aether API",
    description="The intelligence layer and content API backend for Project Aether personal portfolio.",
    version="1.0.0"
)

# Set up CORS middleware for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints
app.include_router(endpoints.router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "api": "online",
            "ai_layer": "ready"
        }
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Project Aether API service...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
