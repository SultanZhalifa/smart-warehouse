"""
SmartWH Backend - FastAPI Server
Handles AI pest detection inference via Roboflow YOLOv8 and persists results to Supabase.
Uses httpx for direct Supabase REST API calls (PostgREST).
"""

import os
import time
import base64
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "")
ROBOFLOW_MODEL = os.getenv("ROBOFLOW_MODEL", "")
ROBOFLOW_VERSION = os.getenv("ROBOFLOW_VERSION", "1")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# Supabase REST API headers
SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

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


def build_mock_predictions() -> list:
    """
    Demo fallback when Roboflow model is not configured.
    Keeps the full app flow functional for presentation and testing.
    """
    return [
        {"class": "gecko", "confidence": 0.87, "x": 245.0, "y": 180.0, "width": 92.0, "height": 55.0},
        {"class": "cat", "confidence": 0.78, "x": 420.0, "y": 260.0, "width": 160.0, "height": 180.0},
    ]


async def supabase_insert(table: str, data: dict | list) -> list:
    """Insert data into a Supabase table via REST API."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return []
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = await http_client.post(url, json=data, headers=SUPABASE_HEADERS)
    if resp.status_code in (200, 201):
        return resp.json()
    print(f"[DB] Insert to {table} failed: {resp.status_code} {resp.text[:200]}")
    return []


async def supabase_select(table: str, select: str = "*", limit: int = 1) -> list:
    """Select data from a Supabase table via REST API."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return []
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}&limit={limit}"
    resp = await http_client.get(url, headers=SUPABASE_HEADERS)
    if resp.status_code == 200:
        return resp.json()
    return []


@app.get("/")
async def root():
    return {"message": "SmartWH Pest Detection API", "status": "online"}


@app.get("/api/health")
async def health_check():
    """Returns server health, model info, and database connection status."""
    db_status = "disconnected"
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            result = await supabase_select("zones", "id", 1)
            db_status = "connected" if isinstance(result, list) else "error"
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
    """
    Run YOLOv8 pest detection on an uploaded image.
    Accepts either a file upload or base64-encoded image.
    Results are automatically saved to Supabase.
    """
    # Get image as base64
    if image and image.filename:
        raw_bytes = await image.read()
        img_base64 = base64.b64encode(raw_bytes).decode("utf-8")
    elif image_base64:
        img_base64 = image_base64.split(",")[1] if "," in image_base64 else image_base64
    else:
        raise HTTPException(status_code=400, detail="No image provided.")

    start_time = time.time()
    if not ROBOFLOW_MODEL or not ROBOFLOW_API_KEY:
        # If model credentials are not configured, use deterministic mock output.
        print("[AI] Using mock predictions (ROBOFLOW_MODEL or ROBOFLOW_API_KEY not configured).")
        predictions = build_mock_predictions()
        inference_ms = int((time.time() - start_time) * 1000)
    else:
        # Call Roboflow API
        roboflow_url = f"https://detect.roboflow.com/{ROBOFLOW_MODEL}/{ROBOFLOW_VERSION}"
        params = {
            "api_key": ROBOFLOW_API_KEY,
            "confidence": confidence_threshold,
            "overlap": overlap_threshold,
        }
        try:
            response = await http_client.post(
                roboflow_url, params=params, content=img_base64,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Roboflow API error: {e.response.text}",
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Failed to reach Roboflow: {str(e)}")

        inference_ms = int((time.time() - start_time) * 1000)
        data = response.json()
        predictions = data.get("predictions", [])

    # Save to Supabase
    detection_id = None
    saved_count = 0

    if predictions:
        try:
            # 1. Create detection session
            det_rows = await supabase_insert("detections", {
                "total_objects": len(predictions),
                "inference_time_ms": inference_ms,
                "model_version": f"YOLOv8 ({ROBOFLOW_MODEL})",
            })

            if det_rows:
                detection_id = det_rows[0]["id"]

                # 2. Save individual detection results
                results = [{
                    "detection_id": detection_id,
                    "class_name": p.get("class", "unknown"),
                    "confidence": p.get("confidence", 0),
                    "x": p.get("x", 0), "y": p.get("y", 0),
                    "width": p.get("width", 0), "height": p.get("height", 0),
                } for p in predictions]
                saved = await supabase_insert("detection_results", results)
                saved_count = len(saved)

                # 3. Create alerts
                for pred in predictions:
                    cls = pred.get("class", "unknown")
                    conf = pred.get("confidence", 0)
                    severity = get_severity(cls)
                    await supabase_insert("alerts", {
                        "type": "critical" if severity == "high" else "warning",
                        "severity": severity,
                        "title": f"{cls.capitalize()} Detected via AI Scan",
                        "message": f"AI detected {cls} ({conf * 100:.1f}% confidence).",
                        "zone_id": zone_id if zone_id else None,
                        "animal_type": cls.lower(),
                        "status": "unread",
                    })

                # 4. Log activity
                species = ", ".join(set(
                    p.get("class", "unknown").capitalize() for p in predictions
                ))
                await supabase_insert("activity_log", {
                    "user_name": user_name,
                    "action": f"AI Pest Scan: {len(predictions)} detection{'s' if len(predictions) != 1 else ''}",
                    "target": species,
                    "type": "detection",
                })

        except Exception as e:
            print(f"[DB] Failed to save results: {e}")

    return {
        "success": True,
        "detection_id": detection_id,
        "inference_time_ms": inference_ms,
        "predictions": predictions,
        "total_detections": len(predictions),
        "saved_results": saved_count,
        "model": ROBOFLOW_MODEL or "mock-fallback",
    }


if __name__ == "__main__":
    import uvicorn

    print(f"SmartWH Backend v1.0.0")
    print(f"Server:   http://{HOST}:{PORT}")
    print(f"Model:    {ROBOFLOW_MODEL or 'NOT SET -- update backend/.env'}")
    print(f"Database: {'Configured' if SUPABASE_URL else 'Not configured'}")
    print()
    uvicorn.run("app:app", host=HOST, port=PORT, reload=True)
