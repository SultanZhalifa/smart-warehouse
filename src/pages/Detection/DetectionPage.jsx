import { useRef, useEffect, useState, useCallback } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import {
  Play, Pause, Camera, Grid3X3, ScanSearch, Clock,
  ZoomIn, ZoomOut, Bug
} from 'lucide-react';
import { getPestIcon, getPestLabel, StatusDot } from '../../components/icons/PestIcons';
import './DetectionPage.css';

// Pest classes for detection — matches our Roboflow model targets
const PEST_CLASSES = [
  { id: 0, name: 'Snake', label: 'SNK', color: '#d95459' },
  { id: 1, name: 'Cat', label: 'CAT', color: '#e5a035' },
  { id: 2, name: 'Gecko', label: 'GKO', color: '#3db8a9' },
];

const SIMULATION_OBJECTS = [
  { cls: 0, x: 120, y: 80, w: 110, h: 40, vx: 0.4, vy: 0.1, conf: 0.96 },
  { cls: 1, x: 350, y: 200, w: 80, h: 70, vx: -0.3, vy: 0.2, conf: 0.94 },
  { cls: 2, x: 500, y: 150, w: 40, h: 25, vx: 0.5, vy: -0.15, conf: 0.89 },
  { cls: 0, x: 200, y: 280, w: 120, h: 35, vx: 0.2, vy: -0.1, conf: 0.92 },
  { cls: 1, x: 450, y: 50, w: 70, h: 65, vx: -0.25, vy: 0.3, conf: 0.91 },
  { cls: 2, x: 80, y: 230, w: 35, h: 20, vx: 0.35, vy: 0.2, conf: 0.87 },
];

export default function DetectionPage() {
  const { state } = useWarehouse();
  const cameras = state.cameras;
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const objectsRef = useRef(SIMULATION_OBJECTS.map((o) => ({ ...o })));
  const [isRunning, setIsRunning] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [detectionLog, setDetectionLog] = useState([]);
  const [totalDetections, setTotalDetections] = useState(0);
  const [showGrid, setShowGrid] = useState(true);

  // Set default camera when data loads
  useEffect(() => {
    if (cameras.length > 0 && !selectedCamera) {
      setSelectedCamera(cameras[0]);
    }
  }, [cameras, selectedCamera]);

  const addDetectionLog = useCallback((obj) => {
    const cls = PEST_CLASSES[obj.cls];
    setDetectionLog((prev) => [
      {
        id: Date.now() + Math.random(),
        class: cls.name,
        label: cls.label,
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
      scanGrad.addColorStop(0.5, 'rgba(217, 84, 89, 0.08)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, W, 40);

      // Objects — pests
      objectsRef.current.forEach((obj, i) => {
        if (!isRunning) return;

        obj.x += obj.vx;
        obj.y += obj.vy;

        if (obj.x <= 0 || obj.x + obj.w >= W) { obj.vx *= -1; obj.x = Math.max(0, Math.min(obj.x, W - obj.w)); }
        if (obj.y <= 0 || obj.y + obj.h >= H) { obj.vy *= -1; obj.y = Math.max(0, Math.min(obj.y, H - obj.h)); }

        const cls = PEST_CLASSES[obj.cls];
        const alpha = 0.6 + 0.4 * Math.sin(frameCount * 0.03 + i);

        // Filled region
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
        ctx.beginPath(); ctx.moveTo(obj.x, obj.y + cornerLen); ctx.lineTo(obj.x, obj.y); ctx.lineTo(obj.x + cornerLen, obj.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(obj.x + obj.w - cornerLen, obj.y); ctx.lineTo(obj.x + obj.w, obj.y); ctx.lineTo(obj.x + obj.w, obj.y + cornerLen); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(obj.x, obj.y + obj.h - cornerLen); ctx.lineTo(obj.x, obj.y + obj.h); ctx.lineTo(obj.x + cornerLen, obj.y + obj.h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(obj.x + obj.w - cornerLen, obj.y + obj.h); ctx.lineTo(obj.x + obj.w, obj.y + obj.h); ctx.lineTo(obj.x + obj.w, obj.y + obj.h - cornerLen); ctx.stroke();

        // Label
        const label = `${cls.emoji} ${cls.name} ${(obj.conf * 100).toFixed(0)}%`;
        ctx.font = '600 11px Inter, sans-serif';
        const textW = ctx.measureText(label).width;
        ctx.fillStyle = cls.color;
        ctx.fillRect(obj.x, obj.y - 18, textW + 10, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, obj.x + 5, obj.y - 5);

        // Log periodically
        if (frameCount % 120 === 0 && i === Math.floor(frameCount / 120) % objectsRef.current.length) {
          addDetectionLog(obj);
        }
      });

      // Viewport corners
      ctx.lineWidth = 2;
      const cl2 = 30;
      ctx.strokeStyle = '#d95459';
      ctx.beginPath(); ctx.moveTo(10, 10 + cl2); ctx.lineTo(10, 10); ctx.lineTo(10 + cl2, 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 10 - cl2, 10); ctx.lineTo(W - 10, 10); ctx.lineTo(W - 10, 10 + cl2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, H - 10 - cl2); ctx.lineTo(10, H - 10); ctx.lineTo(10 + cl2, H - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 10 - cl2, H - 10); ctx.lineTo(W - 10, H - 10); ctx.lineTo(W - 10, H - 10 - cl2); ctx.stroke();

      // Timestamp overlay
      const camLabel = selectedCamera ? selectedCamera.name : 'Camera 1';
      const camRes = selectedCamera ? selectedCamera.resolution : '1920x1080';
      ctx.font = '600 11px Inter, monospace';
      ctx.fillStyle = '#d95459';
      ctx.fillText(`${new Date().toLocaleTimeString()}  |  ${camLabel}  |  ${camRes}  |  PEST DETECTION`, 20, H - 18);

      ctx.textAlign = 'right';
      ctx.fillText(`THREATS: ${objectsRef.current.length}  |  FPS: 30  |  MODEL: YOLOv8`, W - 20, H - 18);
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
          <h1><Bug size={22} /> Pest Detection Simulator</h1>
          <p>Live visualization of bio-hazard pest detection in warehouse zones</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <select
            className="input"
            value={selectedCamera?.id || ''}
            onChange={(e) => setSelectedCamera(cameras.find((c) => c.id === e.target.value) || cameras[0])}
            style={{ minWidth: 160 }}
          >
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.name} — {cam.zones?.name?.split('\u2014')[0]?.trim() || ''}
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

          {/* Pest Classes Legend */}
          <div className="detection-legend">
            <h3><Bug size={16} /> Target Pest Species</h3>
            <div className="legend-items">
              {PEST_CLASSES.map((cls) => (
                <div key={cls.id} className="legend-item">
                  <div className="legend-color" style={{ background: cls.color }}></div>
                  <span className="legend-icon">{getPestIcon(cls.name, 16, cls.color)}</span>
                  <span>{cls.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — Detection Log */}
        <div className="detection-sidebar">
          <div className="detection-sidebar-header">
            <h3><Clock size={16} /> Detection Log</h3>
            <span className="badge badge-danger">{totalDetections} threats</span>
          </div>
          <div className="detection-log-list">
            {detectionLog.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
                <ScanSearch size={32} />
                <h3>Scanning for pests...</h3>
                <p>Detections will appear here in real time</p>
              </div>
            ) : (
              detectionLog.map((log) => (
                <div key={log.id} className="detection-log-item">
                  <div className="detection-log-dot" style={{ background: log.color }}></div>
                  <div className="detection-log-info">
                    <span className="detection-log-class">{getPestIcon(log.class, 14, log.color)} {log.class}</span>
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
              <span className="detection-stat-label">Threats Found</span>
              <span className="detection-stat-value">{objectsRef.current.length}</span>
            </div>
            <div className="detection-stat">
              <span className="detection-stat-label">Model</span>
              <span className="detection-stat-value">YOLOv8</span>
            </div>
            <div className="detection-stat">
              <span className="detection-stat-label">Inference</span>
              <span className="detection-stat-value">~42ms</span>
            </div>
            <div className="detection-stat">
              <span className="detection-stat-label">Species</span>
              <span className="detection-stat-value" style={{ color: 'var(--color-accent-danger)' }}>SNK CAT GKO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
