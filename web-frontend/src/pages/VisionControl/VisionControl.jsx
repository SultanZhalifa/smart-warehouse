import React, { useState, useEffect } from 'react';
import { socket } from '../../services/socket';
import { 
  Camera, Activity, Settings2, ShieldAlert, 
  Maximize2, Eye, EyeOff, Zap, RefreshCw 
} from 'lucide-react';
import './Visioncontrol.css';

/**
 * VISION CONTROL COMPONENT
 * The core monitoring hub connecting the React frontend to the YOLOv8 Python backend.
 * Now handles synchronized Base64 video streaming and AI bounding boxes.
 */
const VisionControl = () => {
  // --- CORE STATES ---
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true); 
  const [threshold, setThreshold] = useState(0.5);
  const [detections, setDetections] = useState([]);
  const [streamFrame, setStreamFrame] = useState(null); // Stores the Base64 image string
  const [isConnected, setIsConnected] = useState(false);

  // --- SOCKET.IO LOGIC ---
  useEffect(() => {
    // 1. Manually connect to the centralized socket service
    socket.connect();

    socket.on('connect', () => {
      console.log("Connected to AI Backend Engine");
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log("Disconnected from AI Backend Engine");
      setIsConnected(false);
      setIsAIEnabled(false);
      setStreamFrame(null);
    });

    /**
     * 2. REAL-TIME DATA LISTENER
     * Receives synchronized image frames and detection coordinates.
     */
    socket.on('vision_data', (data) => {
      if (data.image) setStreamFrame(data.image);
      if (data.detections) setDetections(data.detections);
    });

    // 3. CLEANUP: Ensure resources are released when the user leaves the page
    return () => {
      socket.emit('stop_detection');
      socket.disconnect();
      console.log("Session ended. Connection closed.");
    };
  }, []);

  // --- HANDLERS ---
  const toggleAI = () => {
    if (!isAIEnabled) {
      socket.emit('start_detection');
      setIsAIEnabled(true);
    } else {
      socket.emit('stop_detection');
      setIsAIEnabled(false);
      setDetections([]);
      setStreamFrame(null);
    }
  };

  // Logic: Filters UI boxes based on the current threshold slider
  const filteredDetections = detections.filter(d => d.confidence >= threshold);

  // --- SIDEBAR UI ---
  const renderSidebar = () => {
    return (
      <aside className="vision-sidebar">
        {/* SECTION 1: INFERENCE ENGINE CONTROL */}
        <div className="control-card">
          <div className="card-header">
            <Settings2 size={18} />
            <h3>Inference Engine</h3>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <span>System Status</span>
              <span className={`status-pill ${isConnected ? 'online' : 'offline'}`}>
                {isConnected ? 'BACKEND READY' : 'BACKEND DOWN'}
              </span>
            </div>
            <button 
              className={`action-btn-main ${isAIEnabled ? 'stop' : 'start'}`}
              onClick={toggleAI}
              disabled={!isConnected}
            >
              {isAIEnabled ? 'Disable AI Engine' : 'Enable AI Engine'}
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
              onChange={(e) => setThreshold(parseFloat(e.target.value))} 
            />
          </div>
        </div>

        {/* SECTION 2: LIVE SESSION INSIGHTS */}
        <div className="control-card scrollable">
          <div className="card-header">
            <Activity size={18} />
            <h3>Session Insights</h3>
          </div>
          <div className="insight-list">
            {filteredDetections.length > 0 ? (
              filteredDetections.map((d, index) => (
                <div key={index} className="insight-item">
                  <ShieldAlert size={14} className="alert-icon" />
                  <div className="insight-info">
                    <p className="item-label">{d.class} Detected</p>
                    <p className="item-meta">Confidence: {(d.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No threats detected.</p>
            )}
          </div>
        </div>

        {/* SECTION 3: SYSTEM PERFORMANCE */}
        <div className="system-health-card">
          <div className="health-row">
            <Zap size={14} /> <span>Latency: {isConnected ? '24ms' : 'N/A'}</span>
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
        <main className="vision-viewport">
          <div className="video-stream-layer">
            <div className={`live-indicator ${isAIEnabled ? 'active' : ''}`}>
              {isAIEnabled ? '● LIVE' : 'OFFLINE'}
            </div>

            {/* LIVE VIDEO FEED */}
            {isAIEnabled && streamFrame ? (
              <img 
                src={streamFrame} 
                alt="AI Feed" 
                className="main-video-feed" 
              />
            ) : (
              <div className="video-placeholder-content">
                <Camera size={48} className="mb-4 opacity-20" />
                <p>{isAIEnabled ? 'Waiting for Stream...' : 'AI Engine Idle'}</p>
              </div>
            )}
          </div>

          {/* AI OVERLAY: Draws Bounding Boxes on top of the live image */}
          {showOverlay && isAIEnabled && (
            <div className="ai-overlay-layer">
              {filteredDetections.map((box, index) => (
                <div 
                  key={index}
                  className="ai-bounding-box"
                  style={{
                    // Assumes backend 640x480 resolution. Adjust if your camera differs.
                    left: `${(box.bbox[0] / 640) * 100}%`,
                    top: `${(box.bbox[1] / 480) * 100}%`,
                    width: `${((box.bbox[2] - box.bbox[0]) / 640) * 100}%`,
                    height: `${((box.bbox[3] - box.bbox[1]) / 480) * 100}%`
                  }}
                >
                  <div className="box-tag">
                    {box.class} {(box.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {renderSidebar()}
      </div>
    </div>
  );
};

export default VisionControl;