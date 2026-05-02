# 🚀 Smart Warehouse - Quick Setup Guide

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Firebase account with configured Firestore database
- (Optional) Roboflow account for custom YOLOv8 model

---

## ⚡ Quick Start

### 1. Clone/Navigate to Project
```bash
cd /home/veillab/Downloads/smart-warehouse
```

### 2. Set Up Web Frontend
```bash
cd web-frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173
```

### 3. Set Up AI Backend (in new terminal)
```bash
cd ai-engine

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run AI backend
python app.py
# Starts on http://localhost:5000
```

### 4. Access Application
- Open browser to: `http://localhost:5173`
- Login with your Firebase credentials
- Navigate to **Vision Control Hub** to see AI monitoring
- Check **Activity** page for real-time logs

---

## 🔧 Environment Configuration

### Web Frontend (.env already configured)
```
VITE_FIREBASE_API_KEY=AIzaSyB9G9M2nWl_aa2KxaKXI91_jCWKURtoAiM
VITE_FIREBASE_AUTH_DOMAIN=smart-warehouse-project-51725.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smart-warehouse-project-51725
VITE_FIREBASE_STORAGE_BUCKET=smart-warehouse-project-51725.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=686923732653
VITE_FIREBASE_APP_ID=1:686923732653:web:1f6f56511b75d406ab5824
VITE_FIREBASE_DATABASE_URL=https://smart-warehouse-project-51725.firebaseio.com
```

### AI Backend (.env template provided)
```
# Get from https://roboflow.com/settings/profile
ROBOFLOW_API_KEY=your_api_key_here

# Format: workspace/project/version
ROBOFLOW_MODEL=your_model_slug_here

# Server configuration
HOST=0.0.0.0
PORT=8000
DEBUG=False
```

---

## 📱 Main Features

| Page | Purpose | Status |
|------|---------|--------|
| **Dashboard** | KPI metrics & overview | ✅ Active |
| **Vision Control** | Real-time AI monitoring | ✅ Active |
| **Alerts** | Detection notifications | ✅ Active |
| **Inventory** | Stock management | ✅ Active |
| **Analytics** | Charts & trends | ✅ Active |
| **Activity Log** | System events | ✅ Active |
| **Zones** | Warehouse areas | ✅ Active |
| **Settings** | User profile | ✅ Active |

---

## 🐛 Troubleshooting

### "Backend Connection Refused"
- Make sure AI backend is running: `python app.py` in ai-engine folder
- Check port 5000 is available: `lsof -i :5000` (macOS/Linux)

### "Login Not Working"
- Verify Firebase credentials in `.env`
- Check Firestore rules allow read/write
- Check browser console for error messages

### "Python Module Not Found"
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`
- Verify Python 3.10+: `python --version`

### "Port Already in Use"
- Frontend: Change in vite.config.js
- Backend: Change PORT in ai-engine/.env

---

## 📚 Project Structure

```
smart-warehouse/
├── ai-engine/              # Python Flask backend
│   ├── app.py             # Main application
│   ├── requirements.txt    # Python dependencies
│   ├── best.pt            # YOLOv8 trained model
│   └── .env              # Configuration
│
├── web-frontend/          # React Vite frontend
│   ├── src/
│   │   ├── pages/        # All page components
│   │   ├── components/   # UI components
│   │   ├── context/      # State management (Firebase)
│   │   ├── lib/          # Firebase config & database
│   │   └── services/     # WebSocket & auth services
│   ├── package.json      # Node dependencies
│   └── .env             # Firebase configuration
│
└── docs/                  # Documentation
```

---

## ✅ Verification Checklist

Before deploying:
- [ ] Web frontend runs without errors: `npm run dev`
- [ ] AI backend starts: `python app.py`
- [ ] Frontend connects to backend (Vision Control shows "BACKEND READY")
- [ ] Can login with Firebase credentials
- [ ] Activity logs appear in real-time
- [ ] Dashboard KPIs update correctly

---

## 🔗 Important Links

- **Firebase Console:** https://console.firebase.google.com/
- **Roboflow:** https://roboflow.com/
- **YOLOv8 Docs:** https://docs.ultralytics.com/
- **React Documentation:** https://react.dev/

---

## 📞 Support

For issues or questions:
1. Check `PROJECT_VERIFICATION_REPORT.md` for detailed verification status
2. Review component documentation in `/docs` folder
3. Check browser console for JavaScript errors
4. Check terminal for backend errors

---

**Setup Complete! Start developing! 🎉**
