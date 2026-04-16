import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { CHART_DATA } from '../data/mockData';
import {
  BarChart3, TrendingUp, PieChart, Calendar, Download, RefreshCw
} from 'lucide-react';
import './AnalyticsPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: 500 }, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
    },
    tooltip: {
      backgroundColor: '#1a2035', titleColor: '#f1f5f9', bodyColor: '#94a3b8',
      borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1, padding: 12,
      cornerRadius: 8, titleFont: { family: 'Inter', weight: 600 }, bodyFont: { family: 'Inter' },
    },
  },
  scales: {
    x: { grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
    y: { grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
  },
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('week');

  const detectionLineData = {
    labels: CHART_DATA.detectionsByHour.labels,
    datasets: [{
      label: 'Detections',
      data: CHART_DATA.detectionsByHour.data,
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0, 212, 255, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#00d4ff',
      pointBorderColor: '#0a0e1a',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      borderWidth: 2,
    }],
  };

  const weeklyBarData = {
    labels: CHART_DATA.detectionsByDay.labels,
    datasets: [{
      label: 'Detections per Day',
      data: CHART_DATA.detectionsByDay.data,
      backgroundColor: [
        'rgba(0, 212, 255, 0.7)', 'rgba(124, 58, 237, 0.7)', 'rgba(6, 214, 160, 0.7)',
        'rgba(251, 191, 36, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(236, 72, 153, 0.7)',
        'rgba(59, 130, 246, 0.7)',
      ],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const objectDoughnutData = {
    labels: CHART_DATA.objectDistribution.labels,
    datasets: [{
      data: CHART_DATA.objectDistribution.data,
      backgroundColor: [
        '#00d4ff', '#7c3aed', '#06d6a0', '#fbbf24', '#ef4444', '#ec4899',
      ],
      borderColor: '#111827',
      borderWidth: 3,
      hoverOffset: 8,
    }],
  };

  const zoneBarData = {
    labels: CHART_DATA.zoneActivity.labels,
    datasets: [{
      label: 'Detections by Zone',
      data: CHART_DATA.zoneActivity.data,
      backgroundColor: 'rgba(124, 58, 237, 0.6)',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const inventoryTrendData = {
    labels: CHART_DATA.inventoryTrend.labels,
    datasets: [
      {
        label: 'Items In',
        data: CHART_DATA.inventoryTrend.datasets[0].data,
        borderColor: '#06d6a0',
        backgroundColor: 'rgba(6, 214, 160, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#06d6a0',
        pointBorderColor: '#0a0e1a',
        pointBorderWidth: 2,
      },
      {
        label: 'Items Out',
        data: CHART_DATA.inventoryTrend.datasets[1].data,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#0a0e1a',
        pointBorderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: 500 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 },
      },
      tooltip: chartDefaults.plugins.tooltip,
    },
  };

  return (
    <div className="page analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Data-driven insights for warehouse operations</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <div className="analytics-date-tabs">
            {['day', 'week', 'month', 'year'].map((r) => (
              <button key={r} className={`analytics-date-btn ${dateRange === r ? 'active' : ''}`} onClick={() => setDateRange(r)}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-grid">
        {/* Detection Trend */}
        <div className="analytics-card analytics-wide">
          <div className="analytics-card-header">
            <h3><TrendingUp size={16} /> Detection Trend (Hourly)</h3>
          </div>
          <div className="analytics-chart-wrapper" style={{ height: 280 }}>
            <Line data={detectionLineData} options={chartDefaults} />
          </div>
        </div>

        {/* Weekly Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3><BarChart3 size={16} /> Weekly Distribution</h3>
          </div>
          <div className="analytics-chart-wrapper" style={{ height: 260 }}>
            <Bar data={weeklyBarData} options={chartDefaults} />
          </div>
        </div>

        {/* Object Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3><PieChart size={16} /> Object Classification</h3>
          </div>
          <div className="analytics-chart-wrapper" style={{ height: 260 }}>
            <Doughnut data={objectDoughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Zone Activity */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3><BarChart3 size={16} /> Zone Activity</h3>
          </div>
          <div className="analytics-chart-wrapper" style={{ height: 260 }}>
            <Bar data={zoneBarData} options={chartDefaults} />
          </div>
        </div>

        {/* Inventory Trend */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3><TrendingUp size={16} /> Inventory Flow</h3>
          </div>
          <div className="analytics-chart-wrapper" style={{ height: 260 }}>
            <Line data={inventoryTrendData} options={chartDefaults} />
          </div>
        </div>
      </div>
    </div>
  );
}
