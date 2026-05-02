import React, { useState, useEffect } from 'react';
import { HardDrive, Cpu, Download, AlertCircle, CheckCircle } from 'lucide-react';
import './QuickActionCards.css';

/**
 * QUICK ACTION CARDS COMPONENT
 * Displays system health, storage status, and export functionality
 */
const QuickActionCards = ({ onExport }) => {
  const [systemHealth, setSystemHealth] = useState({
    cpuUsage: 0,
    gpuUsage: 0,
    ramUsage: 0,
    status: 'healthy'
  });

  const [storageStatus, setStorageStatus] = useState({
    used: 0,
    total: 100,
    percentage: 0
  });

  const [exporting, setExporting] = useState(false);

  // Simulate system health monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth({
        cpuUsage: Math.floor(Math.random() * 80) + 10,
        gpuUsage: Math.floor(Math.random() * 70) + 20,
        ramUsage: Math.floor(Math.random() * 60) + 15,
        status: Math.random() > 0.2 ? 'healthy' : 'warning'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate storage status
  useEffect(() => {
    const interval = setInterval(() => {
      const used = Math.floor(Math.random() * 60) + 20;
      setStorageStatus({
        used,
        total: 100,
        percentage: used
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      if (onExport) {
        await onExport();
      }
      // Simulate export completion
      setTimeout(() => {
        setExporting(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setExporting(false);
    }
  };

  const getHealthColor = (value) => {
    if (value < 50) return '#22c55e'; // green
    if (value < 75) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const getHealthStatus = () => {
    const avgUsage = (systemHealth.cpuUsage + systemHealth.gpuUsage + systemHealth.ramUsage) / 3;
    if (avgUsage > 80) return 'critical';
    if (avgUsage > 60) return 'warning';
    return 'healthy';
  };

  return (
    <div className="quick-action-container">
      <h3 className="section-title">System Overview</h3>

      <div className="cards-grid">
        {/* System Health Card */}
        <div className="action-card health-card">
          <div className="card-header">
            <div className="icon-wrapper" style={{ backgroundColor: 'rgba(124, 108, 240, 0.1)' }}>
              <Cpu size={20} style={{ color: '#7c6cf0' }} />
            </div>
            <div className="header-text">
              <h4>System Health</h4>
              <span className={`health-badge ${getHealthStatus()}`}>
                {getHealthStatus().toUpperCase()}
              </span>
            </div>
          </div>

          <div className="health-metrics">
            <div className="metric">
              <span className="metric-label">CPU</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${systemHealth.cpuUsage}%`,
                    backgroundColor: getHealthColor(systemHealth.cpuUsage)
                  }}
                />
              </div>
              <span className="metric-value">{systemHealth.cpuUsage}%</span>
            </div>

            <div className="metric">
              <span className="metric-label">GPU</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${systemHealth.gpuUsage}%`,
                    backgroundColor: getHealthColor(systemHealth.gpuUsage)
                  }}
                />
              </div>
              <span className="metric-value">{systemHealth.gpuUsage}%</span>
            </div>

            <div className="metric">
              <span className="metric-label">RAM</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${systemHealth.ramUsage}%`,
                    backgroundColor: getHealthColor(systemHealth.ramUsage)
                  }}
                />
              </div>
              <span className="metric-value">{systemHealth.ramUsage}%</span>
            </div>
          </div>
        </div>

        {/* Storage Status Card */}
        <div className="action-card storage-card">
          <div className="card-header">
            <div className="icon-wrapper" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <HardDrive size={20} style={{ color: '#22c55e' }} />
            </div>
            <div className="header-text">
              <h4>Storage Status</h4>
              <span className="storage-info">
                {storageStatus.used}GB / {storageStatus.total}GB
              </span>
            </div>
          </div>

          <div className="storage-visual">
            <div className="storage-bar">
              <div
                className="storage-fill"
                style={{
                  width: `${storageStatus.percentage}%`,
                  backgroundColor: storageStatus.percentage > 80 ? '#ef4444' : '#22c55e'
                }}
              />
            </div>
            <p className="storage-percentage">{Math.round(storageStatus.percentage)}% Used</p>
          </div>

          {storageStatus.percentage > 80 && (
            <div className="warning-message">
              <AlertCircle size={16} />
              <span>Storage running low. Consider cleanup.</span>
            </div>
          )}
        </div>

        {/* Export Report Card */}
        <div className="action-card export-card">
          <div className="card-header">
            <div className="icon-wrapper" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
              <Download size={20} style={{ color: '#f97316' }} />
            </div>
            <h4>Export Report</h4>
          </div>

          <div className="export-options">
            <button
              className={`export-btn ${exporting ? 'loading' : ''}`}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="spinner" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download Daily Report
                </>
              )}
            </button>

            <div className="export-formats">
              <span className="format-label">Available formats:</span>
              <div className="format-pills">
                <span className="format-pill">PDF</span>
                <span className="format-pill">CSV</span>
                <span className="format-pill">JSON</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionCards;
