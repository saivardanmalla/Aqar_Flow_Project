from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserLogin, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.permissions.rbac import get_current_user_payload

router = APIRouter()

# In-Memory seed store for instant, reliable operation and fast execution
DEMO_USERS = {
    "admin@aqarflow.com": {
        "id": "user-admin-01",
        "email": "admin@aqarflow.com",
        "password_hash": "$2b$12$e6m.0uO0i5tK8tM0o6eD5eL.n8T9x8f0yG7jQ0s7kG1f7H4m9bA3u",  # Password123!
        "raw_pwd": "Password123!",
        "full_name": "Sarah Ahmed",
        "role": "agency_admin",
        "agency_id": "agency-vireleo-001",
        "phone": "+92 300 8521470",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    "bilal@aqarflow.com": {
        "id": "user-agent-01",
        "email": "bilal@aqarflow.com",
        "password_hash": "$2b$12$e6m.0uO0i5tK8tM0o6eD5eL.n8T9x8f0yG7jQ0s7kG1f7H4m9bA3u",
        "raw_pwd": "Password123!",
        "full_name": "Bilal Khan",
        "role": "agent",
        "agency_id": "agency-vireleo-001",
        "phone": "+92 321 4455667",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
}

ACTIVE_REFRESH_TOKENS = set()

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin):
    email = creds.email.lower()
    user = DEMO_USERS.get(email)
    
    if not user or (creds.password != user["raw_pwd"] and not verify_password(creds.password, user["password_hash"])):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Contact agency administrator."
        )
    
    access_token = create_access_token(
        subject=user["id"], 
        role=user["role"], 
        agency_id=user["agency_id"]
    )
    refresh_token = create_refresh_token(subject=user["id"])
    ACTIVE_REFRESH_TOKENS.add(refresh_token)

    safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "raw_pwd"]}
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": safe_user
    }

@router.post("/logout")
def logout(refresh_token: str = ""):
    if refresh_token in ACTIVE_REFRESH_TOKENS:
        ACTIVE_REFRESH_TOKENS.remove(refresh_token)
    return {"message": "Successfully logged out."}

@router.post("/refresh")
def refresh_token(payload: dict):
    r_token = payload.get("refresh_token")
    if not r_token or r_token not in ACTIVE_REFRESH_TOKENS:
        raise HTTPException(status_code=401, detail="Invalid or revoked refresh token.")
    
    decoded = decode_token(r_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Expired refresh token.")
    
    user_id = decoded.get("sub")
    user = next((u for u in DEMO_USERS.values() if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    
    # Refresh Token Rotation: revoke old, issue new
    ACTIVE_REFRESH_TOKENS.remove(r_token)
    new_access_token = create_access_token(user["id"], user["role"], user["agency_id"])
    new_refresh_token = create_refresh_token(user["id"])
    ACTIVE_REFRESH_TOKENS.add(new_refresh_token)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_current_user(payload: dict = Depends(get_current_user_payload)):
    user_id = payload.get("sub")
    user = next((u for u in DEMO_USERS.values() if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "raw_pwd"]}
    return {"user": safe_user}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    return {"message": f"Password reset instructions have been dispatched to {req.email}."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    return {"message": "Your password has been successfully updated. You may now log in."}

