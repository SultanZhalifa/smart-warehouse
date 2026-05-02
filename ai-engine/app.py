import cv2
import base64
import time
import requests
import os
from datetime import datetime
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from ultralytics import YOLO
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
# Keep ping_timeout high so the stream connection does not drop easily
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=60)

# --- CONFIGURATION ---
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN', 'YOUR_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', 'YOUR_CHAT_ID')
CONFIDENCE_ALERT_LEVEL = float(os.getenv('CONFIDENCE_ALERT_LEVEL', '0.85'))
ALERT_COOLDOWN = int(os.getenv('ALERT_COOLDOWN', '30'))  # seconds

# Telegram Configuration Validation
TELEGRAM_CONFIGURED = (
    TELEGRAM_TOKEN != 'YOUR_BOT_TOKEN' and 
    TELEGRAM_CHAT_ID != 'YOUR_CHAT_ID' and
    TELEGRAM_TOKEN and TELEGRAM_CHAT_ID
)

print("=" * 60)
print("[SYSTEM] AI Engine Configuration")
print("=" * 60)
print(f"Telegram Configured: {'✓ YES' if TELEGRAM_CONFIGURED else '✗ NO (Add to .env)'}")
print(f"Alert Confidence Level: {CONFIDENCE_ALERT_LEVEL}")
print(f"Alert Cooldown: {ALERT_COOLDOWN} seconds")
print("=" * 60)

# 1. LOAD MODEL
try:
    # Load the trained model from best.pt
    model = YOLO('best.pt')
    print("[MODEL] AI Model loaded successfully!")
except Exception as e:
    print(f"[ERROR] Failed to load model: {e}")

is_detecting = False
last_alert_time = 0

def send_telegram_with_photo(frame, label, confidence):
    """Capture detection frame and send a Telegram photo alert."""
    global last_alert_time
    current_time = time.time()
    
    if not TELEGRAM_CONFIGURED:
        print(f"[ALERT] {label} detected (confidence: {confidence:.2f}) - Telegram not configured")
        return
    
    if current_time - last_alert_time > ALERT_COOLDOWN:
        try:
            # Create alerts directory if it doesn't exist
            os.makedirs('alerts', exist_ok=True)
            
            filename = f"alerts/alert_{int(current_time)}.jpg"
            cv2.imwrite(filename, frame)

            caption = (
                f"🚨 *HAMA TERDETEKSI!*\n\n"
                f"📍 Lokasi: Gudang Utama\n"
                f"🎯 Target: {label}\n"
                f"🔥 Confidence: {confidence:.2f}\n"
                f"⏰ Waktu: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            )
            
            url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto"
            
            with open(filename, 'rb') as photo:
                files = {'photo': photo}
                data = {
                    'chat_id': TELEGRAM_CHAT_ID,
                    'caption': caption,
                    'parse_mode': 'Markdown'
                }
                response = requests.post(url, files=files, data=data, timeout=10)
                
                if response.status_code == 200:
                    last_alert_time = current_time
                    print(f"[TELEGRAM] ✓ Alert sent successfully: {label}")
                else:
                    print(f"[TELEGRAM] ✗ Failed to send alert (HTTP {response.status_code})")
                    
        except requests.exceptions.Timeout:
            print(f"[ERROR] Telegram request timeout")
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Telegram connection failed: {e}")
        except Exception as e:
            print(f"[ERROR] Failed to process alert: {e}")

def detection_loop():
    """Background task untuk processing kamera dan AI"""
    global is_detecting
    cap = cv2.VideoCapture(0)
    
    # Optimasi Resolusi (640x480 paling pas buat YOLOv8)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    print("Camera Loop Started.")

    while is_detecting:
        ret, frame = cap.read()
        if not ret:
            break

        # Inference AI
        # verbose=False biar terminal lo nggak penuh sama log deteksi
        results = model(frame, conf=0.4, iou=0.45, verbose=False)
        detections = []
        
        for r in results:
            for box in r.boxes:
                coords = box.xyxy[0].tolist() 
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                label = model.names[cls_id]
                
                detections.append({
                    "bbox": coords,
                    "class": label,
                    "confidence": round(conf, 2)
                })

                # Trigger Telegram photo alert when confidence is high
                if conf >= CONFIDENCE_ALERT_LEVEL:
                    send_telegram_with_photo(frame, label, conf)

        # Encode Frame (Kualitas 70 supaya enteng di React)
        _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
        frame_encoded = base64.b64encode(buffer).decode('utf-8')
        
        # Kirim data ke Frontend
        socketio.emit('vision_data', {
            'image': f"data:image/jpeg;base64,{frame_encoded}",
            'detections': detections
        })
        
        # Beri nafas sedikit buat CPU (Target ~30 FPS)
        socketio.sleep(0.03)

    cap.release()
    print("Camera Loop Stopped.")

# --- SOCKET EVENTS ---

@socketio.on('connect')
def handle_connect():
    print('Frontend connected.')
    # Send current engine status to frontend on connect
    socketio.emit('vision_state', {'is_detecting': is_detecting})

@socketio.on('start_detection')
def handle_start():
    global is_detecting
    if not is_detecting:
        is_detecting = True
        print("Signal Received: Starting AI Engine...")
        socketio.emit('vision_state', {'is_detecting': True})
        socketio.start_background_task(target=detection_loop)
    else:
        print("AI Engine is already running.")

@socketio.on('stop_detection')
def handle_stop():
    global is_detecting
    is_detecting = False
    print("Signal Received: Stopping AI Engine.")
    socketio.emit('vision_state', {'is_detecting': False})

if __name__ == '__main__':
    # Gunakan debug=False di production supaya tidak double-load
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)