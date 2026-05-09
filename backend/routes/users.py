from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from auth import get_current_user
from services.supabase_client import get_supabase

router = APIRouter(prefix="/api", tags=["users"])


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None


@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile."""
    sb = get_supabase()
    result = sb.table("profiles").select("*").eq("id", current_user["id"]).single().execute()
    if not result.data:
        # Auto-create profile if not exists
        profile = {
            "id": current_user["id"],
            "email": current_user["email"],
            "full_name": current_user["user"].user_metadata.get("full_name", ""),
            "avatar_url": current_user["user"].user_metadata.get("avatar_url", ""),
            "role": "buyer",
        }
        sb.table("profiles").insert(profile).execute()
        return profile
    return result.data


@router.put("/profile")
async def update_profile(update: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    """Update current user's profile."""
    sb = get_supabase()
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}

    # Prevent non-owners from setting role to 'owner'
    if update_data.get("role") == "owner" and current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Cannot set role to owner")

    result = sb.table("profiles").update(update_data).eq("id", current_user["id"]).execute()
    return {"profile": result.data[0] if result.data else None}


@router.get("/seller/plots")
async def get_seller_plots(current_user: dict = Depends(get_current_user)):
    """Get all plots listed by the current seller."""
    sb = get_supabase()
    result = sb.table("plots").select("*").eq("seller_id", current_user["id"]).order("created_at", desc=True).execute()
    return {"plots": result.data or []}
