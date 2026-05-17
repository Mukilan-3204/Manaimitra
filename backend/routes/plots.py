from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from auth import get_current_user, require_seller
from services.supabase_client import get_supabase
from services.ai_check import run_ai_check
import uuid

router = APIRouter(prefix="/api", tags=["plots"])


class PlotCreate(BaseModel):
    # Public — visible to buyers
    title: str
    description: str
    area_sqft: float
    price: float
    division: str
    place: str
    place_id: int
    type: str = "Residential Plot"
    facing: str = "East"
    road_size: str = ""
    dtcp_approved: bool = False
    land_photos: List[str] = []

    # Private — visible to owner only
    seller_name: str
    seller_phone: str
    seller_address: str = ""
    dob: str = ""
    patta_number: str = ""
    chitta_number: str = ""
    survey_number: str = ""
    aadhaar_front: str = ""
    aadhaar_back: str = ""
    doc_copies: List[str] = []


class PlotUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    area_sqft: Optional[float] = None
    price: Optional[float] = None
    type: Optional[str] = None
    facing: Optional[str] = None
    road_size: Optional[str] = None
    dtcp_approved: Optional[bool] = None


@router.get("/places/{place_id}/plots")
async def list_plots(place_id: int):
    """List approved plots in a place."""
    sb = get_supabase()
    result = sb.table("plots").select(
        "id,title,description,area_sqft,price,division,place,type,facing,road_size,dtcp_approved,land_photos,status,created_at,views"
    ).eq("place_id", place_id).eq("status", "approved").execute()
    return {"place_id": place_id, "plots": result.data or []}


@router.get("/plots/{plot_id}")
async def get_plot(plot_id: str):
    """Get single plot — public fields only."""
    sb = get_supabase()
    result = sb.table("plots").select(
        "id,title,description,area_sqft,price,division,place,place_id,type,facing,road_size,dtcp_approved,land_photos,status,created_at,views"
    ).eq("id", plot_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    return result.data


@router.get("/plots/{plot_id}/full")
async def get_plot_full(plot_id: str, current_user: dict = Depends(get_current_user)):
    """Get full plot including private fields — owner or seller only."""
    sb = get_supabase()
    result = sb.table("plots").select("*").eq("id", plot_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    plot = result.data
    if current_user["role"] != "owner" and plot.get("seller_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return plot


@router.post("/plots")
async def create_plot(plot: PlotCreate, current_user: dict = Depends(require_seller)):
    """Create a new plot listing."""
    sb = get_supabase()

    existing = sb.table("plots").select("*").eq("seller_id", current_user["id"]).execute()

    # AI check — map seller_address → address key
    plot_data = plot.model_dump()
    plot_data["seller_id"] = current_user["id"]
    plot_data["address"] = plot.seller_address
    plot_data["images"] = plot.land_photos
    ai_result = run_ai_check(plot_data, existing.data or [])
    status = "pending" if ai_result["passed"] else "rejected"

    new_plot = {
        "id": str(uuid.uuid4()),
        "seller_id": current_user["id"],
        "place_id": plot.place_id,
        "title": plot.title,
        "description": plot.description,
        "area_sqft": plot.area_sqft,
        "price": plot.price,
        "division": plot.division,
        "place": plot.place,
        "type": plot.type,
        "facing": plot.facing,
        "road_size": plot.road_size,
        "dtcp_approved": plot.dtcp_approved,
        "land_photos": plot.land_photos,
        "seller_name": plot.seller_name,
        "seller_phone": plot.seller_phone,
        "seller_address": plot.seller_address,
        "dob": plot.dob,
        "patta_number": plot.patta_number,
        "chitta_number": plot.chitta_number,
        "aadhaar_front": plot.aadhaar_front,
        "aadhaar_back": plot.aadhaar_back,
        "doc_copies": plot.doc_copies,
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
    """Update own listing — resets to pending."""
    sb = get_supabase()
    existing = sb.table("plots").select("seller_id").eq("id", plot_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Plot not found")
    if existing.data["seller_id"] != current_user["id"] and current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Re-submit for approval on edit
    update_data["status"] = "pending"
    result = sb.table("plots").update(update_data).eq("id", plot_id).execute()
    return {"plot": result.data[0] if result.data else None}


@router.delete("/plots/{plot_id}")
async def delete_plot(plot_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a plot."""
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
    sb.storage.from_("plot-images").upload(file_name, content, {"content-type": file.content_type or "image/jpeg"})
    public_url = sb.storage.from_("plot-images").get_public_url(file_name)
    return {"url": public_url, "path": file_name}
