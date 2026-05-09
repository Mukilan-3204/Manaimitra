from fastapi import Depends, HTTPException, Header
from services.supabase_client import get_supabase
from config import OWNER_EMAIL


async def get_current_user(authorization: str = Header(None)):
    """Verify Supabase JWT and return user info."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split(" ")[1]
    sb = get_supabase()

    try:
        user_response = sb.auth.get_user(token)
        user = user_response.user
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")

        role = "owner" if user.email == OWNER_EMAIL else None
        if not role:
            profile = sb.table("profiles").select("role").eq("id", user.id).single().execute()
            role = profile.data.get("role", "buyer") if profile.data else "buyer"

        return {"id": user.id, "email": user.email, "role": role, "user": user}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


async def require_seller(current_user: dict = Depends(get_current_user)):
    """Require seller or owner role."""
    if current_user["role"] not in ("seller", "owner"):
        raise HTTPException(status_code=403, detail="Seller access required")
    return current_user


async def require_owner(current_user: dict = Depends(get_current_user)):
    """Require owner role."""
    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")
    return current_user
