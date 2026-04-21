import { useRef, useEffect, useState, useCallback } from 'react';
import { OBJECT_CLASSES, CAMERAS } from '../data/mockData';
import {
  Play, Pause, Camera, Maximize2, Settings, RefreshCw,
  ZoomIn, ZoomOut, Grid3X3, ScanSearch, PieChart, Clock,
  Package, Layers, Truck, HardHat, Cylinder, BoxSelect, Cog, LayoutGrid
} from 'lucide-react';
import './DetectionPage.css';

const ICON_MAP = {
  Package, Layers, Truck, HardHat, Cylinder, BoxSelect, Cog, LayoutGrid,
};

const DETECTION_OBJECTS = [
  { cls: 0, x: 120, y: 80, w: 100, h: 80, vx: 0.3, vy: 0.15, conf: 0.97 },
  { cls: 1, x: 350, y: 200, w: 130, h: 60, vx: -0.2, vy: 0.1, conf: 0.94 },
  { cls: 3, x: 500, y: 150, w: 50, h: 90, vx: 0.5, vy: 0.2, conf: 0.91 },
  { cls: 4, x: 200, y: 280, w: 60, h: 70, vx: 0.1, vy: -0.2, conf: 0.89 },
  { cls: 5, x: 450, y: 50, w: 90, h: 70, vx: -0.3, vy: 0.15, conf: 0.96 },
  { cls: 2, x: 80, y: 230, w: 110, h: 70, vx: 0.4, vy: -0.1, conf: 0.93 },
  { cls: 7, x: 580, y: 280, w: 100, h: 90, vx: -0.15, vy: 0.1, conf: 0.98 },
];

export default function DetectionPage() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const objectsRef = useRef(DETECTION_OBJECTS.map((o) => ({ ...o })));
  const [isRunning, setIsRunning] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(CAMERAS[0]);
  const [detectionLog, setDetectionLog] = useState([]);
  const [totalDetections, setTotalDetections] = useState(0);
  const [showGrid, setShowGrid] = useState(true);

  const addDetectionLog = useCallback((obj) => {
    const cls = OBJECT_CLASSES[obj.cls];
    setDetectionLog((prev) => [
      {
        id: Date.now() + Math.random(),
        class: cls.name,
        confidence: (obj.conf * 100).toFixed(1),
        time: new Date().toLocaleTimeString(),
        color: cls.color,
      },
      ...prev.slice(0, 29),
    ]);
    setTotalDetections((p) => p + 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    let frameCount = 0;

    const draw = () => {
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      // Grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += 30) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 30) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
      }

      // Scanline
      const scanY = (frameCount * 1.5) % H;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, 'rgba(0, 212, 255, 0.08)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, W, 40);

      // Objects
      objectsRef.current.forEach((obj, i) => {
        if (!isRunning) return;

        // Move
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Bounce
        if (obj.x <= 0 || obj.x + obj.w >= W) { obj.vx *= -1; obj.x = Math.max(0, Math.min(obj.x, W - obj.w)); }
        if (obj.y <= 0 || obj.y + obj.h >= H) { obj.vy *= -1; obj.y = Math.max(0, Math.min(obj.y, H - obj.h)); }

        const cls = OBJECT_CLASSES[obj.cls];
        const alpha = 0.6 + 0.4 * Math.sin(frameCount * 0.03 + i);

        // Filled region (simulated object)
        ctx.fillStyle = cls.color + '15';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

        // Bounding box
        ctx.strokeStyle = cls.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;
        ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        ctx.globalAlpha = 1;

        // Corner markers
        const cornerLen = 8;
        ctx.strokeStyle = cls.color;
        ctx.lineWidth = 3;
        // TL
        ctx.beginPath(); ctx.moveTo(obj.x, obj.y + cornerLen); ctx.lineTo(obj.x, obj.y); ctx.lineTo(obj.x + cornerLen, obj.y); ctx.stroke();
        // TR
        ctx.beginPath(); ctx.moveTo(obj.x + obj.w - cornerLen, obj.y); ctx.lineTo(obj.x + obj.w, obj.y); ctx.lineTo(obj.x + obj.w, obj.y + cornerLen); ctx.stroke();
        // BL
        ctx.beginPath(); ctx.moveTo(obj.x, obj.y + obj.h - cornerLen); ctx.lineTo(obj.x, obj.y + obj.h); ctx.lineTo(obj.x + cornerLen, obj.y + obj.h); ctx.stroke();
        // BR
        ctx.beginPath(); ctx.moveTo(obj.x + obj.w - cornerLen, obj.y + obj.h); ctx.lineTo(obj.x + obj.w, obj.y + obj.h); ctx.lineTo(obj.x + obj.w, obj.y + obj.h - cornerLen); ctx.stroke();

        // Label
        const label = `${cls.name} ${(obj.conf * 100).toFixed(0)}%`;
        ctx.font = '600 11px Inter, sans-serif';
        const textW = ctx.measureText(label).width;
        ctx.fillStyle = cls.color;
        ctx.fillRect(obj.x, obj.y - 18, textW + 10, 18);
        ctx.fillStyle = '#1a2332';
        ctx.fillText(label, obj.x + 5, obj.y - 5);

        // Log every 120 frames
        if (frameCount % 120 === 0 && i === frameCount / 120 % objectsRef.current.length) {
          addDetectionLog(obj);
        }
      });

      // Corner markers for viewport
      ctx.strokeStyle = 'var(--color-accent-primary)';
      ctx.lineWidth = 2;
      const cl2 = 30;
      ctx.strokeStyle = '#4a90d9';
      // TL
      ctx.beginPath(); ctx.moveTo(10, 10 + cl2); ctx.lineTo(10, 10); ctx.lineTo(10 + cl2, 10); ctx.stroke();
      // TR
      ctx.beginPath(); ctx.moveTo(W - 10 - cl2, 10); ctx.lineTo(W - 10, 10); ctx.lineTo(W - 10, 10 + cl2); ctx.stroke();
      // BL
      ctx.beginPath(); ctx.moveTo(10, H - 10 - cl2); ctx.lineTo(10, H - 10); ctx.lineTo(10 + cl2, H - 10); ctx.stroke();
      // BR
      ctx.beginPath(); ctx.moveTo(W - 10 - cl2, H - 10); ctx.lineTo(W - 10, H - 10); ctx.lineTo(W - 10, H - 10 - cl2); ctx.stroke();

      // Timestamp overlay
      ctx.font = '600 11px Inter, monospace';
      ctx.fillStyle = '#4a90d9';
      ctx.fillText(new Date().toLocaleTimeString() + '  |  ' + selectedCamera.name + '  |  ' + selectedCamera.resolution, 20, H - 18);

      // FPS & Detection count
      ctx.textAlign = 'right';
      ctx.fillText(`OBJECTS: ${objectsRef.current.length}  |  FPS: 30  |  MODEL: YOLOv8`, W - 20, H - 18);
      ctx.textAlign = 'left';

      frameCount++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, selectedCamera, showGrid, addDetectionLog]);

  return (
    <div className="page detection-page">
      <div className="page-header">
        <div>
          <h1>Object Detection</h1>
          <p>Real-time AI-powered object detection and tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <select
            className="input"
            value={selectedCamera.id}
            onChange={(e) => setSelectedCamera(CAMERAS.find((c) => c.id === e.target.value) || CAMERAS[0])}
            style={{ minWidth: 160 }}
          >
            {CAMERAS.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.name} — {cam.status === 'online' ? '[ON]' : '[OFF]'} {cam.zone.replace('zone-', 'Zone ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="detection-layout">
        {/* Main Canvas */}
        <div className="detection-main">
          <div className="detection-canvas-wrapper">
            <canvas ref={canvasRef} width={720} height={420} className="detection-canvas"></canvas>
            <div className="detection-controls">
              <button className="btn btn-ghost btn-icon" onClick={() => setIsRunning(!isRunning)} title={isRunning ? 'Pause' : 'Play'}>
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowGrid(!showGrid)} title="Toggle Grid">
                <Grid3X3 size={18} />
              </button>
              <button className="btn btn-ghost btn-icon" title="Zoom In">
                <ZoomIn size={18} />
              </button>
              <button className="btn btn-ghost btn-icon" title="Zoom Out">
                <ZoomOut size={18} />
              </button>
              <div style={{ flex: 1 }}></div>
              <div className={`detection-live-badge ${isRunning ? 'live' : ''}`}>
                <span className="detection-live-dot"></span>
                {isRunning ? 'LIVE' : 'PAUSED'}
              </div>
            </div>
          </div>

          {/* Object Classes Legend */}
          <div className="detection-legend">
            <h3><ScanSearch size={16} /> Detected Object Classes</h3>
            <div className="legend-items">
              {OBJECT_CLASSES.map((cls) => {
                const IconComp = ICON_MAP[cls.icon];
                return (
                  <div key={cls.id} className="legend-item">
                    <div className="legend-color" style={{ background: cls.color }}></div>
                    <span className="legend-icon">{IconComp && <IconComp size={14} style={{ color: cls.color }} />}</span>
                    <span>{cls.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar — Detection Log */}
        <div className="detection-sidebar">
          <div className="detection-sidebar-header">
            <h3><Clock size={16} /> Detection Log</h3>
            <span className="badge badge-primary">{totalDetections} total</span>
          </div>
          <div className="detection-log-list">
            {detectionLog.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
                <ScanSearch size={32} />
                <h3>Waiting for detections...</h3>
                <p>Detection events will appear here in real time</p>
              </div>
            ) : (
              detectionLog.map((log) => (
                <div key={log.id} className="detection-log-item">
                  <div className="detection-log-dot" style={{ background: log.color }}></div>
                  <div className="detection-log-info">
                    <span className="detection-log-class">{log.class}</span>
                    <span className="detection-log-time">{log.time}</span>
                  </div>
                  <span className="detection-log-conf" style={{ color: log.color }}>{log.confidence}%</span>
                </div>
              ))
            )}
          </div>

          {/* Stats */}
          <div className="detection-sidebar-stats">
            <div className="detection-stat">
              <span className="detection-stat-label">Objects Found</span>
              <span className="detection-stat-value">{objectsRef.current.length}</span>
            </div>
            <div className="detection-stat">
              <span className="detection-stat-label">Model</span>
              <span className="detection-stat-value">YOLOv8</span>
            </div>
            <div className="detection-stat">
              <span className="detection-stat-label">Inference</span>
              <span className="detection-stat-value">42ms</span>
            </div>
            <div className="detection-stat">
              <span className="detection-stat-label">Accuracy</span>
              <span className="detection-stat-value" style={{ color: 'var(--color-accent-success)' }}>97.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
