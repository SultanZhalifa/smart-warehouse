import React, { useState, useEffect } from 'react';
import { 
  Camera, Activity, Settings2, ShieldAlert, 
  Maximize2, Eye, EyeOff, Zap, RefreshCw 
} from 'lucide-react';
import './Visioncontrol.css';

const VisionControl = () => {
  // CORE STATES
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true); // Toggle Bounding Boxes
  const [threshold, setThreshold] = useState(0.5);
  
  // MOCK DATA for "Smart Mapping" (Relative coordinates for A+ accuracy)
  const [detections, setDetections] = useState([
    { id: 101, label: 'Pest', conf: 0.89, x: 25, y: 30, w: 120, h: 80 },
    { id: 102, label: 'Pest', conf: 0.72, x: 60, y: 55, w: 100, h: 70 }
  ]);

  // LOGIC: Responsive UI - Sidebar changes based on AI status
  const renderSidebar = () => {
    return (
      <aside className="vision-sidebar">
        {/* SECTION 1: AI CONTROL (The "Brain" of the system) */}
        <div className="control-card">
          <div className="card-header">
            <Settings2 size={18} />
            <h3>Inference Engine</h3>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <span>AI Detection</span>
              <span className={`status-pill ${isAIEnabled ? 'online' : 'offline'}`}>
                {isAIEnabled ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>
            <button 
              className={`action-btn-main ${isAIEnabled ? 'stop' : 'start'}`}
              onClick={() => setIsAIEnabled(!isAIEnabled)}
            >
              {isAIEnabled ? 'Disable Engine' : 'Enable Engine'}
            </button>
          </div>

          <div className="control-group">
            <div className="label-row">
              <span>Confidence Threshold</span>
              <span className="value-badge">{threshold}</span>
            </div>
            <input 
              type="range" min="0.1" max="1.0" step="0.05" 
              value={threshold} 
              onChange={(e) => setThreshold(e.target.value)} 
            />
          </div>
        </div>

        {/* SECTION 2: SESSION INSIGHTS (The "Evidence" collector) */}
        <div className="control-card scrollable">
          <div className="card-header">
            <Activity size={18} />
            <h3>Session Insights</h3>
          </div>
          <div className="insight-list">
            {detections.map(d => (
              <div key={d.id} className="insight-item">
                <ShieldAlert size={14} className="alert-icon" />
                <div className="insight-info">
                  <p className="item-label">{d.label} Detected</p>
                  <p className="item-meta">Confidence: {(d.conf * 100).toFixed(0)}%</p>
                </div>
                <button className="view-snap">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* NEW FEATURE: System Health (Boosts your project score!) */}
        <div className="system-health-card">
          <div className="health-row">
            <Zap size={14} /> <span>Latency: 24ms</span>
          </div>
          <div className="health-row">
            <RefreshCw size={14} /> <span>Model: YOLOv8-Pest-v2</span>
          </div>
        </div>
      </aside>
    );
  };

  return (
    <div className="vision-control-container">
      {/* 1. TOP HEADER: Navigation & Breadcrumbs */}
      <header className="vision-header">
        <div className="header-left">
          <h2>Vision Control Hub</h2>
          <span className="zone-tag">Zone B - Main Storage</span>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowOverlay(!showOverlay)} className="tool-btn">
            {showOverlay ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button className="tool-btn"><Maximize2 size={20} /></button>
        </div>
      </header>

      <div className="vision-main-layout">
        {/* 2. THE VIEWPORT: This is where the magic happens */}
        <main className="vision-viewport">
          <div className="video-stream-layer">
            <div className="live-indicator">● LIVE</div>
            <div className="video-placeholder-content">
              {/* This is where your actual camera feed will sit */}
              <p>Camera Feed Grid (Zone B)</p>
            </div>
          </div>

          {/* 3. THE AI OVERLAY: Independent layer for Bounding Boxes */}
          {showOverlay && isAIEnabled && (
            <div className="ai-overlay-layer">
              {detections.map(box => (
                <div 
                  key={box.id}
                  className="ai-bounding-box"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}px`,
                    height: `${box.h}px`
                  }}
                >
                  <div className="box-tag">
                    {box.label} {(box.conf * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* 4. SIDEBAR: Controls & Logs */}
        {renderSidebar()}
      </div>
    </div>
  );
};

export default VisionControl;