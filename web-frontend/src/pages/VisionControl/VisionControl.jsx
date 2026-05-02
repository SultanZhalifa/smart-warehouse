import React, { useState, useRef, useEffect } from 'react';
import { useVision } from '../../context/VisionContext'; 
import DetectionStats from './DetectionStat';
import { 
  Camera, Activity, Settings2, ShieldAlert, 
  Zap, RefreshCw, MessageSquare 
} from 'lucide-react';
import './Visioncontrol.css';

/**
 * VISION CONTROL COMPONENT (UI LAYER)
 * Consumes state from VisionContext to display real-time AI feeds and logs.
 */
const VisionControl = () => {
  // --- CONSUME GLOBAL LOGIC ---
  const { 
    isAIEnabled, 
    streamFrame, 
    detections, 
    toggleAI, 
    isConnected, 
    logs, 
    addActivityLog 
  } = useVision();

  // --- LOCAL UI STATES ---
  const [showOverlay, setShowOverlay] = useState(true);
  const [threshold, setThreshold] = useState(0.5);
  const [localStream, setLocalStream] = useState(null);
  const [isLocalCamera, setIsLocalCamera] = useState(false);
  const [activeTab, setActiveTab] = useState('live');
  const videoRef = useRef(null);

  // Filter detections based on the slider value
  const filteredDetections = detections.filter(d => d.confidence >= threshold);

  // --- LOCAL CAMERA FUNCTIONS ---
  const startLocalCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setLocalStream(stream);
      setIsLocalCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      addActivityLog('Local Camera Started', 'UI');
    } catch (error) {
      console.error('Error accessing camera:', error);
      addActivityLog('Camera Access Failed', 'UI', 'Error');
    }
  };

  const stopLocalCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsLocalCamera(false);
      addActivityLog('Local Camera Stopped', 'UI');
    }
  };

  const toggleLocalCamera = () => {
    if (isLocalCamera) {
      stopLocalCamera();
    } else {
      startLocalCamera();
    }
  };

  // Cleanup local camera on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  const renderSidebar = () => (
    <aside className="vision-sidebar">
      {/* SECTION 1: SYSTEM CONTROLS */}
      <div className="control-card">
        <div className="card-header">
          <Settings2 size={18} />
          <h3>System Control</h3>
        </div>
        <div className="control-group">
          <div className="label-row">
            <span>Status</span>
            <span className={`status-pill ${isConnected ? 'online' : 'offline'}`}>
              {isConnected ? 'BACKEND READY' : 'DISCONNECTED'}
            </span>
          </div>
          {isConnected ? (
            <button 
              className={`action-btn-main ${isAIEnabled ? 'stop' : 'start'}`}
              onClick={toggleAI}
            >
              {isAIEnabled ? 'Disable AI Engine' : 'Enable AI Engine'}
            </button>
          ) : (
            <button 
              className={`action-btn-main ${isLocalCamera ? 'stop' : 'start'}`}
              onClick={toggleLocalCamera}
            >
              {isLocalCamera ? 'Stop Local Camera' : 'Start Local Camera'}
            </button>
          )}
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

      {/* SECTION 2: ACTIVITY LOGS (Sync with Firebase) */}
      <div className="control-card scrollable">
        <div className="card-header">
          <Activity size={18} />
          <h3>Activity Logs</h3>
        </div>
        <div className="insight-list">
          {logs.length > 0 ? (
            logs.slice(0, 10).map((log, index) => (
              <div key={index} className="insight-item">
                <div className={`log-indicator ${log.category?.toLowerCase() || 'system'}`} />
                <div className="insight-info">
                  <p className="item-label">{log.action}</p>
                  <p className="item-meta">{log.timestamp} • {log.status}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">System standby. No logs yet.</p>
          )}
        </div>
      </div>

      {/* SECTION 3: CUSTOMER SERVICE */}
      <div className="support-section">
        <div className="system-health-card">
          <div className="health-row"><Zap size={14} /> <span>Latency: 24ms</span></div>
          <div className="health-row"><RefreshCw size={14} /> <span>v1.0.0-stable</span></div>
        </div>
        <div className="support-spacer"></div>
        <button 
          className="support-btn"
          onClick={() => window.open('https://wa.me/your-number', '_blank')}
        >
          <MessageSquare size={16} />
          <span>Contact Support</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="vision-control-container">
      <header className="vision-header">
        <div className="header-left">
          <h2>Vision Control Hub</h2>
          <span className="zone-tag">Main Warehouse • Live</span>
        </div>
      </header>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'live' ? 'active' : ''}`} 
          onClick={() => setActiveTab('live')}
        >
          Live Monitoring
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`} 
          onClick={() => setActiveTab('analytics')}
        >
          Analytics & Logs
        </button>
      </div>

      {activeTab === 'live' ? (
        <div className="vision-main-layout">
          <main className="vision-viewport">
          <div className="video-stream-layer">
            <div className={`live-indicator ${isConnected ? (isAIEnabled ? 'active' : '') : (isLocalCamera ? 'active' : '')}`}>
              {isConnected ? (isAIEnabled ? '● LIVE FEED' : 'STANDBY') : (isLocalCamera ? '● LOCAL CAMERA' : 'STANDBY')}
            </div>
            {isConnected ? (
              isAIEnabled && streamFrame ? (
                <img src={streamFrame} alt="AI Feed" className="main-video-feed" />
              ) : (
                <div className="video-placeholder-content">
                  <Camera size={48} className="mb-4 opacity-20" />
                  <p>{isAIEnabled ? 'Waiting for stream data...' : 'AI Engine Offline'}</p>
                </div>
              )
            ) : (
              isLocalCamera ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="main-video-feed" 
                />
              ) : (
                <div className="video-placeholder-content">
                  <Camera size={48} className="mb-4 opacity-20" />
                  <p>Local Camera Offline</p>
                </div>
              )
            )}
          </div>

          {/* AI BOUNDING BOXES */}
          {showOverlay && isAIEnabled && (
            <div className="ai-overlay-layer">
              {filteredDetections.map((box, index) => (
                <div 
                  key={index}
                  className="ai-bounding-box"
                  style={{
                    left: `${(box.bbox[0] / 640) * 100}%`,
                    top: `${(box.bbox[1] / 480) * 100}%`,
                    width: `${((box.bbox[2] - box.bbox[0]) / 640) * 100}%`,
                    height: `${((box.bbox[3] - box.bbox[1]) / 480) * 100}%`
                  }}
                >
                  <div className="box-tag">{box.class} {(box.confidence * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          )}
        </main>
        {renderSidebar()}
      </div>
      ) : (
        <div className="analytics-main-layout">
          <div className="analytics-content">
            <DetectionStats />
          </div>
          <div className="analytics-sidebar">
            <div className="analytics-log-panel control-card scrollable">
              <div className="card-header">
                <Activity size={18} />
                <h3>Activity Logs</h3>
              </div>
              <div className="insight-list">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="insight-item">
                      <div className={`log-indicator ${log.category?.toLowerCase() || 'system'}`} />
                      <div className="insight-info">
                        <p className="item-label">{log.action}</p>
                        <p className="item-meta">{log.timestamp} • {log.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">System standby. No logs yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionControl;