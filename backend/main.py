from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.interview import router as interview_router
from routes.feedback import router as feedback_router

# ✅ Initialize FastAPI app
app = FastAPI(
    title="Virtual Interview API",
    description="🚀 AI-powered API for authentication, interview processing, and feedback analysis",
    version="1.0.0",
)

# ✅ Fix CORS Issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ Only allow frontend, replace * if needed
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # ✅ Explicitly allow required methods
    allow_headers=["*"],  # ✅ Allow all headers
)

# ✅ Register route modules
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(interview_router, prefix="/interview", tags=["Interview"])
app.include_router(feedback_router, prefix="/feedback", tags=["Feedback"])

# ✅ Root endpoint
@app.get("/", tags=["General"])
def read_root():
    return {"message": "🚀 FastAPI is running!", "docs": "/docs", "redoc": "/redoc"}

# ✅ Health check endpoint
@app.get("/health", tags=["General"])
def health_check():
    return {"status": "✅ OK", "message": "API is healthy and running!"}
