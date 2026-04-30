import cv2
import torch
import base64
import numpy as np
from ultralytics import YOLO
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize SocketIO with CORS allowed for React frontend (usually port 3000 or 5173)
socketio = SocketIO(app, cors_allowed_origins="*")

# 1. LOAD TRAINED MODEL
# Ensure 'best.pt' is in the same directory as this script
try:
    model = YOLO('best.pt')
    print("Model best.pt loaded successfully! System ready for pest detection.")
except Exception as e:
    print(f"Failed to load model: {e}. Ensure 'best.pt' exists in the folder.")

# Control variable to prevent multiple webcam sessions
is_detecting = False

def apply_clahe(frame):
    """
    Preprocessing to handle low-light or blurry warehouse conditions.
    Enhances contrast using Contrast Limited Adaptive Histogram Equalization.
    """
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced_gray = clahe.apply(gray)
    return cv2.cvtColor(enhanced_gray, cv2.COLOR_GRAY2BGR)

@socketio.on('start_detection')
def handle_detection():
    global is_detecting
    if is_detecting:
        print("Detection engine is already running.")
        return
    
    # Open laptop webcam (Index 0 is default internal camera)
    cap = cv2.VideoCapture(0) 
    
    if not cap.isOpened():
        print("Error: Could not open webcam hardware.")
        socketio.emit('error_message', {'message': 'Webcam not found'})
        return

    is_detecting = True
    print("Webcam active. Streaming frames and coordinates to frontend...")
    
    try:
        while is_detecting and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # --- STEP 1: PREPROCESSING ---
            processed_frame = apply_clahe(frame)

            # --- STEP 2: INFERENCE ---
            # stream=True optimizes memory for live video
            results = model(processed_frame, conf=0.25, iou=0.45, stream=True)

            detections = []
            for r in results:
                for box in r.boxes:
                    # Extract bounding box coordinates [x1, y1, x2, y2], class, and confidence
                    coords = box.xyxy[0].tolist() 
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    
                    detections.append({
                        "bbox": coords,
                        "class": model.names[cls_id],
                        "confidence": round(conf, 2)
                    })

            # --- STEP 3: VIDEO ENCODING ---
            # Encode the processed frame to JPEG, then to Base64 string for WebSocket transmission
            _, buffer = cv2.imencode('.jpg', processed_frame)
            frame_encoded = base64.b64encode(buffer).decode('utf-8')
            image_data = f"data:image/jpeg;base64,{frame_encoded}"

            # --- STEP 4: EMIT DATA ---
            # Send both image frame and coordinates in a single synchronized packet
            socketio.emit('vision_data', {
                'image': image_data,
                'detections': detections
            })
            
            # Short sleep to prevent CPU spikes and stabilize socket connection
            socketio.sleep(0.01)
            
    except Exception as e:
        print(f"Runtime Error: {e}")
    finally:
        cap.release()
        is_detecting = False
        print("Webcam released and detection stopped.")

@socketio.on('stop_detection')
def handle_stop():
    global is_detecting
    is_detecting = False
    print("Stop request received from frontend.")

@socketio.on('connect')
def test_connect():
    print('Frontend client connected to AI Backend.')

if __name__ == '__main__':
    # Run server on all interfaces (0.0.0.0) at port 5000
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)