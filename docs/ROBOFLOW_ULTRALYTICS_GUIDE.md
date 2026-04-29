# Roboflow + Ultralytics Integration Guide

## Overview

Smart Warehouse menggunakan dua platform utama untuk fitur object detection:

1. **Roboflow** -- platform untuk dataset management, annotation, dan model deployment
2. **Ultralytics** -- framework di balik arsitektur YOLOv8 yang kita pakai untuk training model

Halaman "AI Detection" di aplikasi kita memungkinkan user untuk upload foto gudang, lalu sistem akan mendeteksi objek-objek (box, pallet, forklift, dll) secara real-time menggunakan model YOLOv8 yang di-host di Roboflow.

---

## Workflow

```
Dataset Preparation → Model Training → Model Deployment → Frontend Integration
   (Roboflow)          (Ultralytics)      (Roboflow API)       (React App)
```

### Step 1: Dataset Preparation (Roboflow)

Kita menggunakan dataset dari Roboflow Universe yang sudah memiliki 7,695 gambar warehouse yang sudah di-annotate. Dataset ini di-fork ke workspace kita agar bisa di-customize.

- **Source**: Roboflow Universe (warehouse-objects by warehousedata)
- **Total Images**: 7,695
- **Split**: 5,742 train / 1,297 valid / 656 test
- **Classes (9)**: box, forklift, person, pallet, carrier, crate, pallet_truck, small_load_carrier, stillage
- **Preprocessing**: Auto-Orient, Resize to 640x640 (Stretch)

### Step 2: Model Training (Ultralytics YOLOv8)

Training dilakukan melalui Roboflow yang menggunakan Ultralytics YOLOv8 sebagai framework di backend-nya.

- **Architecture**: Roboflow 3.0 (YOLOv8-compatible)
- **Model Size**: Accurate
- **Checkpoint**: MS COCO pre-trained weights (transfer learning)
- **Epochs**: 300
- **Resolution**: 640x640
- **Framework**: Ultralytics (https://www.ultralytics.com/)

### Step 3: Model Deployment (Roboflow Hosted API)

Setelah training selesai, model langsung available sebagai hosted REST API di Roboflow.

- **Endpoint**: `https://detect.roboflow.com/{model_id}/{version}`
- **Method**: POST
- **Input**: Base64-encoded image
- **Output**: JSON array of predictions (class, confidence, bounding box coordinates)

### Step 4: Frontend Integration (React)

Di sisi frontend, kita mengirim gambar yang di-upload user ke Roboflow API menggunakan JavaScript `fetch()`.

```javascript
const response = await fetch(
  `https://detect.roboflow.com/${MODEL_ID}/${VERSION}?api_key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: base64ImageString,
  }
);
const data = await response.json();
// data.predictions = [{ class, confidence, x, y, width, height }, ...]
```

Hasil predictions kemudian di-render sebagai bounding boxes di atas gambar menggunakan CSS positioning.

---

## File yang Relevan

| File | Fungsi |
|------|--------|
| `web-frontend/src/pages/AIDetection/AIDetectionPage.jsx` | Halaman AI Detection -- upload gambar, panggil API, render bounding boxes |
| `web-frontend/src/pages/AIDetection/AIDetectionPage.css` | Styling untuk halaman AI Detection |
| `web-frontend/src/pages/Detection/DetectionPage.jsx` | Halaman detection simulasi (canvas animation) |

---

## API Response Format

Contoh response dari Roboflow Inference API:

```json
{
  "predictions": [
    {
      "x": 245.5,
      "y": 180.0,
      "width": 120.0,
      "height": 95.0,
      "confidence": 0.92,
      "class": "box",
      "image_path": "...",
      "prediction_type": "ObjectDetectionModel"
    },
    {
      "x": 450.0,
      "y": 300.0,
      "width": 200.0,
      "height": 150.0,
      "confidence": 0.87,
      "class": "pallet",
      "image_path": "...",
      "prediction_type": "ObjectDetectionModel"
    }
  ],
  "image": {
    "width": 640,
    "height": 640
  }
}
```

---

## Object Classes

| Class | Description |
|-------|-------------|
| box | Kardus atau kotak barang |
| forklift | Kendaraan forklift |
| person | Orang / pekerja gudang |
| pallet | Palet kayu untuk penumpukan |
| carrier | Alat angkut kecil |
| crate | Peti atau kontainer kecil |
| pallet_truck | Hand pallet truck |
| small_load_carrier | Carrier untuk barang kecil |
| stillage | Rak penyimpanan besi |

---

## Links

- **Roboflow Dashboard**: https://app.roboflow.com/smart-warehouse
- **Roboflow Universe (Dataset)**: https://universe.roboflow.com/warehousedata/warehouse-objects-miafr
- **Ultralytics Website**: https://www.ultralytics.com/
- **Ultralytics YOLOv8 Docs**: https://docs.ultralytics.com/
- **Roboflow Inference Docs**: https://docs.roboflow.com/deploy

---

## Notes

- API key disimpan di frontend untuk keperluan demo. Di production, API key harus disimpan di backend dan di-proxy ke Roboflow API.
- Model di-train menggunakan transfer learning dari checkpoint MS COCO, yang sudah memiliki knowledge dasar tentang berbagai objek umum.
- Confidence threshold di-set ke 40% untuk menangkap sebanyak mungkin objek, tapi bisa di-adjust sesuai kebutuhan.
- Model akan terus meningkat seiring penambahan data dan re-training.

---

Last Updated: April 23, 2026
