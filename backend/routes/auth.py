from fastapi import APIRouter, Depends, HTTPException, Header, status
from services.auth_service import verify_token  # Import Firebase token verification function

router = APIRouter()

# ✅ Public Route - Just for Testing API
@router.get("/login")
def login():
    return {"message": "✅ Login API is working!"}

# ✅ Protected Route - Requires Firebase Authentication Token
@router.get("/protected")
async def protected_route(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="🚫 Missing Authorization Header")

    try:
        token = authorization.split("Bearer ")[-1]  # Extract the token
        user_data = verify_token(token)  # Verify token using auth_service
        return {"message": "✅ Access granted!", "user": user_data}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="🚫 Invalid or Expired Token")
