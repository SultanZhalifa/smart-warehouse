"""
SmartWH Backend - FastAPI Server
Handles AI pest detection inference via Roboflow YOLOv8 and persists results to Supabase.
"""

import os
import time
import base64
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "")
ROBOFLOW_MODEL = os.getenv("ROBOFLOW_MODEL", "")
ROBOFLOW_VERSION = os.getenv("ROBOFLOW_VERSION", "1")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
http_client = httpx.AsyncClient(timeout=30.0)

app = FastAPI(
    title="SmartWH Pest Detection API",
    description="AI-powered pest detection backend using YOLOv8 via Roboflow",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEVERITY_MAP = {
    "snake": "high", "rat": "high", "mouse": "high", "cockroach": "high",
    "cat": "medium", "gecko": "medium", "lizard": "medium",
}


def get_severity(class_name: str) -> str:
    return SEVERITY_MAP.get(class_name.lower(), "low")


@app.get("/")
async def root():
    return {"message": "SmartWH Pest Detection API", "status": "online"}


@app.get("/api/health")
async def health_check():
    db_status = "disconnected"
    if supabase:
        try:
            supabase.table("zones").select("id").limit(1).execute()
            db_status = "connected"
        except Exception:
            db_status = "error"

    return {
        "status": "online",
        "model": ROBOFLOW_MODEL or "not configured",
        "model_version": ROBOFLOW_VERSION,
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/detect")
async def detect_pests(
    image: UploadFile = File(None),
    image_base64: str = Form(None),
    user_name: str = Form("System"),
    zone_id: str = Form(None),
    confidence_threshold: int = Form(40),
    overlap_threshold: int = Form(30),
):
    if not ROBOFLOW_MODEL:
        raise HTTPException(status_code=503, detail="Roboflow model not configured. Set ROBOFLOW_MODEL in backend/.env")

    if image and image.filename:
        raw_bytes = await image.read()
        img_base64 = base64.b64encode(raw_bytes).decode("utf-8")
    elif image_base64:
        if "," in image_base64:
            img_base64 = image_base64.split(",")[1]
        else:
            img_base64 = image_base64
    else:
        raise HTTPException(status_code=400, detail="No image provided.")

    roboflow_url = f"https://detect.roboflow.com/{ROBOFLOW_MODEL}/{ROBOFLOW_VERSION}"
    params = {
        "api_key": ROBOFLOW_API_KEY,
        "confidence": confidence_threshold,
        "overlap": overlap_threshold,
    }

    start_time = time.time()
    try:
        response = await http_client.post(
            roboflow_url, params=params, content=img_base64,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Roboflow API error: {e.response.text}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Failed to reach Roboflow: {str(e)}")

    inference_ms = int((time.time() - start_time) * 1000)
    data = response.json()
    predictions = data.get("predictions", [])

    detection_id = None
    saved_results = []

    if supabase and predictions:
        try:
            det = supabase.table("detections").insert({
                "total_objects": len(predictions),
                "inference_time_ms": inference_ms,
                "model_version": f"YOLOv8 ({ROBOFLOW_MODEL})",
            }).execute()

            if det.data:
                detection_id = det.data[0]["id"]
                results = [{
                    "detection_id": detection_id,
                    "class_name": p.get("class", "unknown"),
                    "confidence": p.get("confidence", 0),
                    "x": p.get("x", 0), "y": p.get("y", 0),
                    "width": p.get("width", 0), "height": p.get("height", 0),
                } for p in predictions]

                res = supabase.table("detection_results").insert(results).execute()
                saved_results = res.data or []

                for pred in predictions:
                    cls = pred.get("class", "unknown")
                    conf = pred.get("confidence", 0)
                    severity = get_severity(cls)
                    supabase.table("alerts").insert({
                        "type": "critical" if severity == "high" else "warning",
                        "severity": severity,
                        "title": f"{cls.capitalize()} Detected via AI Scan",
                        "message": f"AI detected {cls} ({conf*100:.1f}% confidence).",
                        "zone_id": zone_id if zone_id else None,
                        "animal_type": cls.lower(),
                        "status": "unread",
                    }).execute()

                species_list = ", ".join(set(p.get("class", "unknown").capitalize() for p in predictions))
                supabase.table("activity_log").insert({
                    "user_name": user_name,
                    "action": f"AI Pest Scan: {len(predictions)} detection{'s' if len(predictions) != 1 else ''}",
                    "target": species_list,
                    "type": "detection",
                }).execute()
        except Exception as e:
            print(f"[DB] Failed to save results: {e}")

    return {
        "success": True,
        "detection_id": detection_id,
        "inference_time_ms": inference_ms,
        "predictions": predictions,
        "total_detections": len(predictions),
        "saved_results": len(saved_results),
        "model": ROBOFLOW_MODEL,
    }


if __name__ == "__main__":
    import uvicorn
    print(f"Starting SmartWH Backend on http://{HOST}:{PORT}")
    print(f"Model: {ROBOFLOW_MODEL or 'NOT SET'}")
    print(f"Database: {'Connected' if supabase else 'Not configured'}")
    uvicorn.run("app:app", host=HOST, port=PORT, reload=True)
