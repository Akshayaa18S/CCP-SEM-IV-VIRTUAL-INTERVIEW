import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException

# 🔹 Initialize Firebase Admin SDK (Ensure you have your Firebase credentials JSON file)
cred = credentials.Certificate("config/serviceAccountKey.json")  # Update with the correct path
firebase_admin.initialize_app(cred)

# 🔹 Function to Verify Firebase Token
def verify_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # Contains user details like uid, email, name
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# 🔹 Get User Details from Firebase UID
def get_user(uid: str):
    try:
        user_record = auth.get_user(uid)
        return {
            "uid": user_record.uid,
            "email": user_record.email,
            "display_name": user_record.display_name,
            "photo_url": user_record.photo_url,
        }
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")

# 🔹 Create a New User (Optional)
def create_user(email: str, password: str, display_name: str = ""):
    try:
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name,
        )
        return {"uid": user.uid, "email": user.email, "display_name": user.display_name}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
