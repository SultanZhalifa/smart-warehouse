"""
SmartWH - YOLOv8 Pest Detection Model Training Script
Downloads dataset from Roboflow and trains a custom YOLOv8 model.
"""

import os
from dotenv import load_dotenv

load_dotenv()

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "")


def main():
    try:
        from roboflow import Roboflow
        from ultralytics import YOLO
    except ImportError:
        print("Missing dependencies. Install them with:")
        print("  pip install roboflow ultralytics")
        return

    print("Downloading dataset from Roboflow...")
    rf = Roboflow(api_key=ROBOFLOW_API_KEY)
    project = rf.workspace().project("pest-detection")
    dataset = project.version(1).download("yolov8")
    print(f"Dataset downloaded to: {dataset.location}")

    print("Training YOLOv8 model...")
    model = YOLO("yolov8n.pt")
    model.train(
        data=f"{dataset.location}/data.yaml",
        epochs=50,
        imgsz=640,
        batch=16,
        name="pest-detection",
        project="runs",
    )

    print("Running validation...")
    metrics = model.val()
    print(f"mAP50: {metrics.box.map50:.3f}")
    print(f"mAP50-95: {metrics.box.map:.3f}")

    print("Training complete. Best model: runs/pest-detection/weights/best.pt")


if __name__ == "__main__":
    main()
