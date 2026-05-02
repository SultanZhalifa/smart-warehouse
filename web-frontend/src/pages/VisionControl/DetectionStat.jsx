import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import './DetectionStats.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const DetectionStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    byClass: {},
    hourlyCounts: {},
    lineLabels: [],
    hourly: [],
    peakHours: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(
          collection(db, 'activity_logs'),
          orderBy('createdAt', 'desc'),
          limit(160)
        );

        const querySnapshot = await getDocs(q);
        let total = 0;
        let todayCount = 0;
        let classes = {};
        let hourlyCounts = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const createdAtRaw = data.createdAt;
          const createdAt = createdAtRaw?.toDate
            ? createdAtRaw.toDate()
            : new Date(createdAtRaw);

          const isDetection = data.category === 'AI_ALARM' || /^Alert:/i.test(data.action || '');
          if (!isDetection) return;

          total += 1;

          if (createdAt >= today) {
            todayCount += 1;
          }

          const pestLabel = data.label
            || (data.action || 'Unknown').replace(/^Alert:\s*/i, '')
            || 'Unknown';

          classes[pestLabel] = (classes[pestLabel] || 0) + 1;

          if (createdAt instanceof Date && !Number.isNaN(createdAt.getTime())) {
            const hourKey = `${String(createdAt.getHours()).padStart(2, '0')}:00`;
            hourlyCounts[hourKey] = (hourlyCounts[hourKey] || 0) + 1;
          }
        });

        const lineLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
        const hourly = lineLabels.map((label) => hourlyCounts[label] || 0);
        const peakHours = Object.entries(hourlyCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([hour, count]) => ({ hour, count }));

        setStats({
          total,
          today: todayCount,
          byClass: classes,
          hourlyCounts,
          lineLabels,
          hourly,
          peakHours
        });
      } catch (error) {
        console.error('Error loading detection stats:', error);
      }
    };

    fetchStats();
  }, []);

  const classKeys = Object.keys(stats.byClass);
  const topClass = classKeys.length > 0
    ? classKeys.reduce((a, b) => stats.byClass[a] > stats.byClass[b] ? a : b)
    : 'None';

  const lineData = {
    labels: stats.lineLabels,
    datasets: [
      {
        label: 'Detection Trend',
        data: stats.hourly,
        borderColor: '#7c6cf0',
        backgroundColor: 'rgba(124, 108, 240, 0.14)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#7c6cf0',
        pointBorderColor: 'rgba(255,255,255,0.9)',
        pointBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: classKeys,
    datasets: [
      {
        data: classKeys.map((label) => stats.byClass[label]),
        backgroundColor: ['#7c6cf0', '#22c55e', '#f97316', '#0ea5e9', '#facc15', '#ec4899'],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(148,163,184,0.18)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 12,
        titleFont: { family: 'Inter', weight: 600 },
        bodyFont: { family: 'Inter' },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148,163,184,0.12)', drawBorder: false },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: { color: 'rgba(148,163,184,0.12)', drawBorder: false },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
          beginAtZero: true,
          precision: 0,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          font: { family: 'Inter', size: 11, weight: 500 },
          padding: 14,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: chartOptions.plugins.tooltip,
    },
  };

  const hasTrendData = stats.hourly.some((value) => value > 0);
  const hasDistribution = classKeys.length > 0;

  return (
    <div className="detection-stats-panel">
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Detections</h4>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card alert">
          <h4>Detected Today</h4>
          <p className="stat-value">{stats.today}</p>
        </div>
        <div className="stat-card">
          <h4>Most Frequent</h4>
          <p className="stat-value">{topClass}</p>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h4>Detection Activity Trend</h4>
            <span>Hourly alerts from the AI detection feed</span>
          </div>
          <div className="chart-wrapper">
            {hasTrendData ? (
              <Line data={lineData} options={chartOptions} />
            ) : (
              <div className="chart-empty-state">
                <p>No detection activity available yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-sidebar">
          <div className="chart-card">
            <div className="chart-card-header">
              <h4>Pest Detection Distribution</h4>
              <span>Relative count by pest type</span>
            </div>
            <div className="chart-wrapper chart-wrapper--compact">
              {hasDistribution ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <div className="chart-empty-state">
                  <p>No pest classification data found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="chart-card peak-hours-card">
            <div className="chart-card-header">
              <h4>Peak Alert Hours</h4>
              <span>Most active detection windows</span>
            </div>
            <div className="peak-hours-list">
              {stats.peakHours.length > 0 ? (
                <table className="peak-hours-table">
                  <thead>
                    <tr>
                      <th>Hour</th>
                      <th>Alerts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.peakHours.map((row) => (
                      <tr key={row.hour}>
                        <td>{row.hour}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="chart-empty-state">
                  <p>Waiting for alert events to build hour peaks.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionStats;