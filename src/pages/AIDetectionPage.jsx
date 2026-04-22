import { useState, useRef, useCallback } from 'react';
import {
  Upload, ImagePlus, Loader2, X, Zap, Target,
  Box, AlertCircle, BarChart3, Camera
} from 'lucide-react';
import './AIDetectionPage.css';

// ----- Roboflow Config -----
const ROBOFLOW_API_KEY = 'KhJq1P9jOEDJsmxtZddPu';
const ROBOFLOW_MODEL = 'warehouse-objects-miafr-wamvd';
const ROBOFLOW_VERSION = '1';
const API_URL = `https://detect.roboflow.com/${ROBOFLOW_MODEL}/${ROBOFLOW_VERSION}`;
// ---------------------------------------------------------

const CLASS_COLORS = {
  box: '#4a90d9',
  forklift: '#e5a035',
  person: '#d95459',
  pallet: '#3db8a9',
  carrier: '#7c6cf0',
  crate: '#f97316',
  pallet_truck: '#ec4899',
  small_load_carrier: '#06b6d4',
  stillage: '#84cc16',
};

function getColor(cls) {
  const key = cls?.toLowerCase() || '';
  return CLASS_COLORS[key] || '#4a90d9';
}

export default function AIDetectionPage() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inferenceTime, setInferenceTime] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP)');
      return;
    }

    setError('');
    setPredictions([]);
    setInferenceTime(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const runDetection = useCallback(async () => {
    if (!image) return;

    if (ROBOFLOW_API_KEY === 'YOUR_API_KEY_HERE') {
      setError('API key belum di-set! Buka AIDetectionPage.jsx, ganti ROBOFLOW_API_KEY dengan key dari akun Roboflow lo.');
      return;
    }

    setLoading(true);
    setError('');
    setPredictions([]);

    try {
      const base64 = image.split(',')[1];
      const startTime = performance.now();

      const response = await fetch(`${API_URL}?api_key=${ROBOFLOW_API_KEY}&confidence=40&overlap=30`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: base64,
      });

      const endTime = performance.now();
      setInferenceTime(Math.round(endTime - startTime));

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPredictions(data.predictions || []);

      if (data.image) {
        setImageSize({ width: data.image.width, height: data.image.height });
      }
    } catch (err) {
      setError(`Detection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [image]);

  const handleImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (img) {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    }
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
    setImagePreview(null);
    setPredictions([]);
    setError('');
    setInferenceTime(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        setImage(ev.target.result);
        setError('');
        setPredictions([]);
        setInferenceTime(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // group predictions by class
  const classSummary = predictions.reduce((acc, p) => {
    const cls = p.class;
    if (!acc[cls]) acc[cls] = { count: 0, totalConf: 0 };
    acc[cls].count += 1;
    acc[cls].totalConf += p.confidence;
    return acc;
  }, {});

  return (
    <div className="ai-detection-page">
      {/* Header */}
      <div className="ai-det-header">
        <div>
          <h1><Zap size={24} /> AI Object Detection</h1>
          <p>Powered by YOLOv8 (Ultralytics) via Roboflow Inference API</p>
        </div>
        <div className="ai-det-badges">
          <span className="ai-det-badge roboflow"><Camera size={14} /> Roboflow</span>
          <span className="ai-det-badge ultralytics"><Target size={14} /> Ultralytics</span>
        </div>
      </div>

      <div className="ai-det-body">
        {/* Left: Image + Canvas */}
        <div className="ai-det-canvas-section">
          {!imagePreview ? (
            <div
              className="ai-det-dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="ai-det-dropzone-icon">
                <ImagePlus size={48} strokeWidth={1.5} />
              </div>
              <h3>Upload Warehouse Image</h3>
              <p>Drag & drop or click to select an image</p>
              <p className="ai-det-dropzone-hint">Supports JPEG, PNG, WebP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="ai-det-image-wrapper">
              <div className="ai-det-image-toolbar">
                <span className="ai-det-image-info">
                  {imageSize.width}x{imageSize.height}px
                  {predictions.length > 0 && ` | ${predictions.length} objects detected`}
                </span>
                <div className="ai-det-image-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={runDetection}
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 size={14} className="ai-det-spin" /> Detecting...</>
                    ) : (
                      <><Zap size={14} /> Run Detection</>
                    )}
                  </button>
                  <button className="btn btn-sm" onClick={clearImage}>
                    <X size={14} /> Clear
                  </button>
                </div>
              </div>

              <div className="ai-det-image-container">
                <img
                  ref={imgRef}
                  src={imagePreview}
                  alt="Uploaded"
                  className="ai-det-image"
                  onLoad={handleImageLoad}
                />
                {/* Bounding box overlays */}
                {predictions.map((p, i) => {
                  const img = imgRef.current;
                  if (!img) return null;
                  const scaleX = img.clientWidth / img.naturalWidth;
                  const scaleY = img.clientHeight / img.naturalHeight;
                  const left = (p.x - p.width / 2) * scaleX;
                  const top = (p.y - p.height / 2) * scaleY;
                  const width = p.width * scaleX;
                  const height = p.height * scaleY;
                  const color = getColor(p.class);

                  return (
                    <div
                      key={i}
                      className="ai-det-bbox"
                      style={{
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${width}px`,
                        height: `${height}px`,
                        borderColor: color,
                      }}
                    >
                      <span
                        className="ai-det-bbox-label"
                        style={{ backgroundColor: color }}
                      >
                        {p.class} {(p.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="ai-det-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: Results Panel */}
        <div className="ai-det-results">
          {/* Stats */}
          <div className="ai-det-stats-grid">
            <div className="ai-det-stat">
              <div className="ai-det-stat-label">Objects Found</div>
              <div className="ai-det-stat-value">{predictions.length}</div>
            </div>
            <div className="ai-det-stat">
              <div className="ai-det-stat-label">Classes</div>
              <div className="ai-det-stat-value">{Object.keys(classSummary).length}</div>
            </div>
            <div className="ai-det-stat">
              <div className="ai-det-stat-label">Inference</div>
              <div className="ai-det-stat-value">
                {inferenceTime ? `${inferenceTime}ms` : '--'}
              </div>
            </div>
            <div className="ai-det-stat">
              <div className="ai-det-stat-label">Model</div>
              <div className="ai-det-stat-value ai-det-stat-small">YOLOv8</div>
            </div>
          </div>

          {/* Class Breakdown */}
          <div className="ai-det-panel">
            <h3><BarChart3 size={16} /> Detection Summary</h3>
            {Object.keys(classSummary).length === 0 ? (
              <div className="ai-det-empty">
                <Upload size={20} />
                <p>Upload an image and run detection to see results</p>
              </div>
            ) : (
              <div className="ai-det-class-list">
                {Object.entries(classSummary)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([cls, info]) => (
                    <div key={cls} className="ai-det-class-item">
                      <div className="ai-det-class-info">
                        <span
                          className="ai-det-class-dot"
                          style={{ backgroundColor: getColor(cls) }}
                        />
                        <span className="ai-det-class-name">{cls}</span>
                      </div>
                      <div className="ai-det-class-meta">
                        <span className="ai-det-class-count">{info.count}x</span>
                        <span className="ai-det-class-conf">
                          {((info.totalConf / info.count) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Detection Log */}
          <div className="ai-det-panel">
            <h3><Box size={16} /> Detection Log</h3>
            {predictions.length === 0 ? (
              <div className="ai-det-empty">
                <Target size={20} />
                <p>No detections yet</p>
              </div>
            ) : (
              <div className="ai-det-log">
                {predictions.map((p, i) => (
                  <div key={i} className="ai-det-log-item">
                    <span
                      className="ai-det-log-dot"
                      style={{ backgroundColor: getColor(p.class) }}
                    />
                    <span className="ai-det-log-class">{p.class}</span>
                    <span className="ai-det-log-conf">
                      {(p.confidence * 100).toFixed(1)}%
                    </span>
                    <span className="ai-det-log-pos">
                      ({Math.round(p.x)}, {Math.round(p.y)})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tech Stack Info */}
          <div className="ai-det-tech">
            <h4>Technology Stack</h4>
            <div className="ai-det-tech-items">
              <div className="ai-det-tech-item">
                <strong>Model</strong>
                <span>Roboflow 3.0 (YOLOv8)</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Framework</strong>
                <span>Ultralytics</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Dataset</strong>
                <span>7,695 images</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Classes</strong>
                <span>9 object types</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Inference</strong>
                <span>Roboflow Hosted API</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Resolution</strong>
                <span>640x640</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
