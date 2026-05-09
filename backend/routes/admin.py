from fastapi import APIRouter, Depends, HTTPException
from auth import require_owner, get_current_user
from services.supabase_client import get_supabase

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/pending")
async def list_pending(owner: dict = Depends(require_owner)):
    """List all plots pending approval."""
    sb = get_supabase()
    result = sb.table("plots").select("*").eq("status", "pending").order("created_at", desc=True).execute()
    return {"plots": result.data or []}


@router.put("/plots/{plot_id}/approve")
async def approve_plot(plot_id: str, owner: dict = Depends(require_owner)):
    """Approve a seller listing."""
    sb = get_supabase()
    result = sb.table("plots").update({"status": "approved"}).eq("id", plot_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    return {"message": "Plot approved", "plot": result.data[0]}


@router.put("/plots/{plot_id}/reject")
async def reject_plot(plot_id: str, owner: dict = Depends(require_owner)):
    """Reject a seller listing."""
    sb = get_supabase()
    result = sb.table("plots").update({"status": "rejected"}).eq("id", plot_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    return {"message": "Plot rejected", "plot": result.data[0]}


@router.delete("/plots/{plot_id}")
async def delete_plot_admin(plot_id: str, owner: dict = Depends(require_owner)):
    """Owner deletes any plot."""
    sb = get_supabase()
    sb.table("plots").delete().eq("id", plot_id).execute()
    return {"message": "Plot deleted"}


@router.get("/users")
async def list_users(owner: dict = Depends(require_owner)):
    """List all registered users."""
    sb = get_supabase()
    result = sb.table("profiles").select("*").order("created_at", desc=True).execute()
    return {"users": result.data or []}


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, owner: dict = Depends(require_owner)):
    """Owner deletes a user and all their data."""
    sb = get_supabase()
    # Delete user's plots first
    sb.table("plots").delete().eq("seller_id", user_id).execute()
    # Delete profile
    sb.table("profiles").delete().eq("id", user_id).execute()
    # Delete from auth
    try:
        sb.auth.admin.delete_user(user_id)
    except Exception:
        pass  # Auth deletion may fail gracefully
    return {"message": "User and all their data deleted"}


@router.get("/stats")
async def get_stats(owner: dict = Depends(require_owner)):
    """Platform statistics for owner dashboard."""
    sb = get_supabase()
    plots = sb.table("plots").select("status").execute()
    users = sb.table("profiles").select("role").execute()

    all_plots = plots.data or []
    all_users = users.data or []

    return {
        "plots": {
            "total": len(all_plots),
            "approved": sum(1 for p in all_plots if p["status"] == "approved"),
            "pending": sum(1 for p in all_plots if p["status"] == "pending"),
            "rejected": sum(1 for p in all_plots if p["status"] == "rejected"),
        },
        "users": {
            "total": len(all_users),
            "buyers": sum(1 for u in all_users if u["role"] == "buyer"),
            "sellers": sum(1 for u in all_users if u["role"] == "seller"),
        }
    }
