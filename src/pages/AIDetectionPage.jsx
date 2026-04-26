import { useState, useRef, useCallback } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { useAuth } from '../context/AuthContext';
import * as db from '../lib/database';
import {
  Upload, ImagePlus, Loader2, X, Zap, Target,
  Bug, AlertCircle, BarChart3, Camera, Save, Shield,
  CheckCircle, AlertTriangle, Circle
} from 'lucide-react';
import { getPestIcon, StatusDot } from '../components/icons/PestIcons';
import './AIDetectionPage.css';

// ----- Roboflow Config -----
const ROBOFLOW_API_KEY = import.meta.env.VITE_ROBOFLOW_API_KEY || '';
const ROBOFLOW_MODEL = import.meta.env.VITE_ROBOFLOW_MODEL || '';
const ROBOFLOW_VERSION = import.meta.env.VITE_ROBOFLOW_VERSION || '1';
const API_URL = `https://detect.roboflow.com/${ROBOFLOW_MODEL}/${ROBOFLOW_VERSION}`;

// Pest-themed colors for detection classes
const PEST_COLORS = {
  snake: '#d95459',
  cat: '#e5a035',
  gecko: '#3db8a9',
  lizard: '#3db8a9',
  rat: '#7c6cf0',
  mouse: '#7c6cf0',
  bird: '#4a90d9',
  insect: '#f97316',
  cockroach: '#84cc16',
  // Fallbacks for any other detection classes
  default: '#4a90d9',
};

function getColor(cls) {
  const key = cls?.toLowerCase() || '';
  return PEST_COLORS[key] || PEST_COLORS.default;
}

function getLabel(cls) {
  return (cls || 'unknown').charAt(0).toUpperCase() + (cls || 'unknown').slice(1);
}

function getSeverity(cls) {
  const key = cls?.toLowerCase() || '';
  if (['snake'].includes(key)) return 'high';
  if (['rat', 'mouse', 'cockroach'].includes(key)) return 'high';
  if (['cat', 'gecko', 'lizard'].includes(key)) return 'medium';
  return 'low';
}

export default function AIDetectionPage() {
  const { state, dispatch, addToast, refreshData } = useWarehouse();
  const { user } = useAuth();
  const cameras = state.cameras;
  const zones = state.zones;

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [inferenceTime, setInferenceTime] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
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
    setSaved(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const runDetection = useCallback(async () => {
    if (!image) return;

    setLoading(true);
    setError('');
    setPredictions([]);
    setSaved(false);

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
        const errText = await response.text();
        setError(`API Error (${response.status}): ${errText || 'Failed to process image'}`);
        return;
      }

      const data = await response.json();
      const preds = data.predictions || [];
      setPredictions(preds);

      if (data.image) {
        setImageSize({ width: data.image.width, height: data.image.height });
      }

      if (preds.length > 0) {
        addToast({
          type: 'success',
          title: `${preds.length} Pest(s) Detected!`,
          message: `Found: ${[...new Set(preds.map(p => p.class))].join(', ')}`,
        });
      } else {
        addToast({
          type: 'info',
          title: 'Scan Complete',
          message: 'No pests detected in this image. Area is clear.',
        });
      }
    } catch (err) {
      setError(`Network Error: ${err.message}. Check your internet connection.`);
    } finally {
      setLoading(false);
    }
  }, [image, addToast]);

  // Save detection results to Supabase
  const saveToDatabase = useCallback(async () => {
    if (predictions.length === 0) return;

    setSaving(true);
    try {
      // 1. Create the detection record
      const detection = await db.createDetection({
        camera_id: selectedCamera || null,
        zone_id: selectedZone || null,
        image_url: null, // Could upload to storage in future
        model_version: `roboflow-${ROBOFLOW_MODEL}-v${ROBOFLOW_VERSION}`,
        inference_time_ms: inferenceTime,
        total_objects: predictions.length,
        status: 'completed',
      });

      // 2. Create detection results for each prediction
      const results = predictions.map((p) => ({
        detection_id: detection.id,
        class_name: p.class,
        confidence: p.confidence,
        bbox_x: Math.round(p.x),
        bbox_y: Math.round(p.y),
        bbox_width: Math.round(p.width),
        bbox_height: Math.round(p.height),
      }));
      await db.createDetectionResults(results);

      // 3. Create alerts for dangerous pests
      const uniqueClasses = [...new Set(predictions.map(p => p.class))];
      for (const cls of uniqueClasses) {
        const severity = getSeverity(cls);
        const highConfPred = predictions
          .filter(p => p.class === cls)
          .sort((a, b) => b.confidence - a.confidence)[0];

        const alert = await db.createAlert({
          type: severity === 'high' ? 'critical' : 'warning',
          severity,
          title: `${getLabel(cls)} Detected via AI Scan`,
          message: `AI detected ${cls} (${(highConfPred.confidence * 100).toFixed(1)}% confidence) in ${
            zones.find(z => z.id === selectedZone)?.name || 'unspecified zone'
          }. Immediate response recommended.`,
          zone_id: selectedZone || null,
          animal_type: cls.toLowerCase(),
          status: 'unread',
        });
        dispatch({ type: 'ADD_ALERT', payload: alert });
      }

      // 4. Log the activity
      await db.logActivity({
        user_name: user?.name || 'System',
        action: `AI Pest Scan: ${predictions.length} detections`,
        target: uniqueClasses.map(c => getLabel(c)).join(', '),
        type: 'detection',
      });

      setSaved(true);
      addToast({
        type: 'success',
        title: 'Results Saved to Database',
        message: `${predictions.length} detections + ${uniqueClasses.length} alert(s) created`,
      });
      refreshData();
    } catch (err) {
      addToast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  }, [predictions, selectedCamera, selectedZone, inferenceTime, zones, user, dispatch, addToast, refreshData]);

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
    setSaved(false);
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
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Group predictions by class
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
          <h1><Bug size={24} /> AI Pest Detection</h1>
          <p>Upload warehouse images to detect snakes, cats, geckos & other pests via YOLOv8</p>
        </div>
        <div className="ai-det-badges">
          <span className="ai-det-badge roboflow"><Camera size={14} /> Roboflow</span>
          <span className="ai-det-badge ultralytics"><Target size={14} /> YOLOv8</span>
          <span className="ai-det-badge supabase"><Shield size={14} /> Supabase</span>
        </div>
      </div>

      {/* Context Selectors */}
      <div className="ai-det-context-bar">
        <div className="ai-det-context-item">
          <Camera size={14} />
          <select
            className="input"
            value={selectedCamera}
            onChange={(e) => {
              setSelectedCamera(e.target.value);
              // Auto-select zone from camera
              const cam = cameras.find(c => c.id === e.target.value);
              if (cam?.zone_id) setSelectedZone(cam.zone_id);
            }}
          >
            <option value="">Select Camera (optional)</option>
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.name} — {cam.zones?.name?.split('\u2014')[0]?.trim() || ''}
              </option>
            ))}
          </select>
        </div>
        <div className="ai-det-context-item">
          <Target size={14} />
          <select
            className="input"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            <option value="">Select Zone (optional)</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
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
              <h3>Upload Warehouse / Zone Image</h3>
              <p>Drag & drop or click to select an image for pest scanning</p>
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
                  {predictions.length > 0 && ` | ${predictions.length} pest(s) detected`}
                </span>
                <div className="ai-det-image-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={runDetection}
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 size={14} className="ai-det-spin" /> Scanning...</>
                    ) : (
                      <><Zap size={14} /> Scan for Pests</>
                    )}
                  </button>
                  {predictions.length > 0 && !saved && (
                    <button
                      className="btn btn-sm"
                      onClick={saveToDatabase}
                      disabled={saving}
                      style={{ background: '#10b981', color: 'white', border: 'none' }}
                    >
                      {saving ? (
                        <><Loader2 size={14} className="ai-det-spin" /> Saving...</>
                      ) : (
                        <><Save size={14} /> Save to DB</>
                      )}
                    </button>
                  )}
                  {saved && (
                    <span className="ai-det-saved-badge">
                      <CheckCircle size={14} /> Saved
                    </span>
                  )}
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
                        {getPestIcon(p.class, 12, '#fff')} {p.class} {(p.confidence * 100).toFixed(1)}%
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
              <div className="ai-det-stat-label">Pests Found</div>
              <div className="ai-det-stat-value">{predictions.length}</div>
            </div>
            <div className="ai-det-stat">
              <div className="ai-det-stat-label">Species</div>
              <div className="ai-det-stat-value">{Object.keys(classSummary).length}</div>
            </div>
            <div className="ai-det-stat">
              <div className="ai-det-stat-label">Inference</div>
              <div className="ai-det-stat-value">
                {inferenceTime ? `${inferenceTime}ms` : '--'}
              </div>
            </div>
            <div className="ai-det-stat">
              <div className="ai-det-stat-label">Threat Level</div>
              <div className="ai-det-stat-value ai-det-stat-small" style={{
                color: predictions.some(p => getSeverity(p.class) === 'high')
                  ? '#d95459'
                  : predictions.length > 0 ? '#e5a035' : '#10b981'
              }}>
                {predictions.some(p => getSeverity(p.class) === 'high')
                  ? 'HIGH'
                  : predictions.length > 0 ? 'MEDIUM' : 'CLEAR'}
              </div>
            </div>
          </div>

          {/* Class Breakdown */}
          <div className="ai-det-panel">
            <h3><BarChart3 size={16} /> Detection Summary</h3>
            {Object.keys(classSummary).length === 0 ? (
              <div className="ai-det-empty">
                <Upload size={20} />
                <p>Upload an image and scan to detect pests</p>
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
                        <span className="ai-det-class-name">{getPestIcon(cls, 14, getColor(cls))} {cls}</span>
                      </div>
                      <div className="ai-det-class-meta">
                        <span className="ai-det-class-count">{info.count}x</span>
                        <span className="ai-det-class-conf">
                          {((info.totalConf / info.count) * 100).toFixed(1)}%
                        </span>
                        <span className={`ai-det-severity ${getSeverity(cls)}`}>
                          <StatusDot status={getSeverity(cls)} size={8} />
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Detection Log */}
          <div className="ai-det-panel">
            <h3><Bug size={16} /> Detection Log</h3>
            {predictions.length === 0 ? (
              <div className="ai-det-empty">
                <Target size={20} />
                <p>No pests detected yet</p>
              </div>
            ) : (
              <div className="ai-det-log">
                {predictions.map((p, i) => (
                  <div key={i} className="ai-det-log-item">
                    <span
                      className="ai-det-log-dot"
                      style={{ backgroundColor: getColor(p.class) }}
                    />
                    <span className="ai-det-log-class">{getPestIcon(p.class, 12, getColor(p.class))} {p.class}</span>
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
                <span>YOLOv8 (Roboflow)</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Framework</strong>
                <span>Ultralytics</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Targets</strong>
                <span>Snake, Cat, Gecko</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Backend</strong>
                <span>Supabase (PostgreSQL)</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Inference</strong>
                <span>Roboflow Hosted API</span>
              </div>
              <div className="ai-det-tech-item">
                <strong>Storage</strong>
                <span>Real-time DB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
