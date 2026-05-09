from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from auth import get_current_user, require_seller
from services.supabase_client import get_supabase
from services.ai_check import run_ai_check
import uuid

router = APIRouter(prefix="/api", tags=["plots"])


class PlotCreate(BaseModel):
    title: str
    description: str
    area_sqft: float
    price: float
    address: str
    division: str
    place: str
    place_id: int
    type: str = "Residential Plot"
    seller_name: str
    seller_phone: str
    images: List[str] = []


class PlotUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    area_sqft: Optional[float] = None
    price: Optional[float] = None
    address: Optional[str] = None
    type: Optional[str] = None


@router.get("/places/{place_id}/plots")
async def list_plots(place_id: int):
    """List approved plots in a place."""
    sb = get_supabase()
    result = sb.table("plots").select("*").eq("place_id", place_id).eq("status", "approved").execute()
    return {"place_id": place_id, "plots": result.data or []}


@router.get("/plots/{plot_id}")
async def get_plot(plot_id: str):
    """Get single plot details."""
    sb = get_supabase()
    result = sb.table("plots").select("*").eq("id", plot_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    return result.data


@router.post("/plots")
async def create_plot(plot: PlotCreate, current_user: dict = Depends(require_seller)):
    """Create a new plot listing. Runs AI check before submission."""
    sb = get_supabase()

    # Get existing plots for duplicate detection
    existing = sb.table("plots").select("*").eq("seller_id", current_user["id"]).execute()

    # Run AI auto-check
    plot_data = plot.model_dump()
    plot_data["seller_id"] = current_user["id"]
    ai_result = run_ai_check(plot_data, existing.data or [])

    # Determine status based on AI check
    status = "pending" if ai_result["passed"] else "rejected"

    # Insert into database
    new_plot = {
        "id": str(uuid.uuid4()),
        "seller_id": current_user["id"],
        "place_id": plot.place_id,
        "title": plot.title,
        "description": plot.description,
        "area_sqft": plot.area_sqft,
        "price": plot.price,
        "address": plot.address,
        "division": plot.division,
        "place": plot.place,
        "type": plot.type,
        "seller_name": plot.seller_name,
        "seller_phone": plot.seller_phone,
        "images": plot.images,
        "status": status,
        "ai_check_result": ai_result,
        "ai_check_passed": ai_result["passed"],
    }

    result = sb.table("plots").insert(new_plot).execute()

    return {
        "plot": result.data[0] if result.data else new_plot,
        "ai_result": ai_result,
        "status": status,
    }


@router.put("/plots/{plot_id}")
async def update_plot(plot_id: str, update: PlotUpdate, current_user: dict = Depends(require_seller)):
    """Update own listing."""
    sb = get_supabase()

    # Verify ownership
    existing = sb.table("plots").select("seller_id").eq("id", plot_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    if existing.data["seller_id"] != current_user["id"] and current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = sb.table("plots").update(update_data).eq("id", plot_id).execute()
    return {"plot": result.data[0] if result.data else None}


@router.delete("/plots/{plot_id}")
async def delete_plot(plot_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a plot. Seller can delete own, owner can delete any."""
    sb = get_supabase()

    existing = sb.table("plots").select("seller_id").eq("id", plot_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    if existing.data["seller_id"] != current_user["id"] and current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")

    sb.table("plots").delete().eq("id", plot_id).execute()
    return {"message": "Plot deleted"}


@router.post("/upload")
async def upload_image(file: UploadFile = File(...), current_user: dict = Depends(require_seller)):
    """Upload a plot image to Supabase Storage."""
    sb = get_supabase()

    file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
    file_name = f"plots/{current_user['id']}/{uuid.uuid4()}.{file_ext}"
    content = await file.read()

    result = sb.storage.from_("plot-images").upload(file_name, content, {"content-type": file.content_type or "image/jpeg"})

    public_url = sb.storage.from_("plot-images").get_public_url(file_name)
    return {"url": public_url, "path": file_name}
