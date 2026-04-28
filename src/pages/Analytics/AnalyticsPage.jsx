import { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useWarehouse } from '../../context/WarehouseContext';
import * as db from '../../lib/database';
import {
  BarChart3, TrendingUp, PieChart, Download, Loader2, AlertCircle
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
    y: { grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, beginAtZero: true },
  },
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

export default function AnalyticsPage() {
  const { state } = useWarehouse();
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCharts() {
      setLoading(true);
      try {
        const [hourly, daily, pests, zones, trend] = await Promise.all([
          db.fetchDetectionsByHour(),
          db.fetchDetectionsByDay(7),
          db.fetchPestDistribution(),
          db.fetchAlertsByZone(),
          db.fetchThreatTrend(4),
        ]);
        if (!cancelled) {
          setChartData({ hourly, daily, pests, zones, trend });
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
        if (!cancelled) setChartData(null);
      }
      if (!cancelled) setLoading(false);
    }
    loadCharts();
    return () => { cancelled = true; };
  }, [dateRange]);

  // Build Chart.js data objects from real data
  const detectionLineData = chartData ? {
    labels: chartData.hourly.labels,
    datasets: [{
      label: 'Pest Detections',
      data: chartData.hourly.data,
      borderColor: '#d95459',
      backgroundColor: 'rgba(217, 84, 89, 0.08)',
      fill: true, tension: 0.4, pointRadius: 3,
      pointBackgroundColor: '#d95459', pointBorderColor: '#1a2332', pointBorderWidth: 2,
      pointHoverRadius: 6, borderWidth: 2,
    }],
  } : null;

  const weeklyBarData = chartData ? {
    labels: chartData.daily.labels,
    datasets: [{
      label: 'Detections per Day',
      data: chartData.daily.data,
      backgroundColor: [
        'rgba(0, 212, 255, 0.7)', 'rgba(124, 58, 237, 0.7)', 'rgba(6, 214, 160, 0.7)',
        'rgba(251, 191, 36, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(236, 72, 153, 0.7)',
        'rgba(59, 130, 246, 0.7)',
      ],
      borderRadius: 8, borderSkipped: false,
    }],
  } : null;

  const pestLabels = chartData ? Object.keys(chartData.pests) : [];
  const pestValues = chartData ? Object.values(chartData.pests) : [];
  const pestColors = { snake: '#d95459', cat: '#e5a035', gecko: '#3db8a9' };
  const objectDoughnutData = chartData ? {
    labels: pestLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{
      data: pestValues,
      backgroundColor: pestLabels.map(l => pestColors[l] || '#4a90d9'),
      borderColor: '#111827', borderWidth: 3, hoverOffset: 8,
    }],
  } : null;

  const zoneBarData = chartData ? {
    labels: chartData.zones.labels,
    datasets: [{
      label: 'Alerts by Zone',
      data: chartData.zones.data,
      backgroundColor: 'rgba(217, 84, 89, 0.6)',
      borderRadius: 6, borderSkipped: false,
    }],
  } : null;

  const threatTrendData = chartData ? {
    labels: chartData.trend.labels,
    datasets: [
      {
        label: 'Threats Detected', data: chartData.trend.detected,
        borderColor: '#3db8a9', backgroundColor: 'rgba(6, 214, 160, 0.08)',
        fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4,
        pointBackgroundColor: '#3db8a9', pointBorderColor: '#1a2332', pointBorderWidth: 2,
      },
      {
        label: 'Threats Resolved', data: chartData.trend.resolved,
        borderColor: '#d95459', backgroundColor: 'rgba(239, 68, 68, 0.08)',
        fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4,
        pointBackgroundColor: '#d95459', pointBorderColor: '#1a2332', pointBorderWidth: 2,
      },
    ],
  } : null;

  const hasData = chartData && (
    chartData.hourly.data.some(v => v > 0) ||
    pestLabels.length > 0 ||
    chartData.zones.labels.length > 0
  );

  return (
    <div className="page analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Pest detection insights and risk mitigation data</p>
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

      {loading ? (
        <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
          <Loader2 size={32} className="spin" />
          <h3>Loading analytics data...</h3>
          <p>Querying detection results from database</p>
        </div>
      ) : !hasData ? (
        <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
          <AlertCircle size={32} />
          <h3>No detection data yet</h3>
          <p>Run AI Detection scans to populate charts with real data. All analytics are sourced directly from the Supabase database.</p>
        </div>
      ) : (
        <div className="analytics-grid">
          {/* Detection Trend */}
          <div className="analytics-card analytics-wide">
            <div className="analytics-card-header">
              <h3><TrendingUp size={16} /> Pest Detection Trend (Hourly)</h3>
            </div>
            <div className="analytics-chart-wrapper" style={{ height: 280 }}>
              {detectionLineData && <Line data={detectionLineData} options={chartDefaults} />}
            </div>
          </div>

          {/* Weekly Distribution */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3><BarChart3 size={16} /> Weekly Distribution</h3>
            </div>
            <div className="analytics-chart-wrapper" style={{ height: 260 }}>
              {weeklyBarData && <Bar data={weeklyBarData} options={chartDefaults} />}
            </div>
          </div>

          {/* Pest Species Distribution */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3><PieChart size={16} /> Pest Species Distribution</h3>
            </div>
            <div className="analytics-chart-wrapper" style={{ height: 260 }}>
              {objectDoughnutData && pestLabels.length > 0
                ? <Doughnut data={objectDoughnutData} options={doughnutOptions} />
                : <div className="empty-state"><p>No pest detections recorded yet</p></div>
              }
            </div>
          </div>

          {/* Zone Activity */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3><BarChart3 size={16} /> Zone Alert Activity</h3>
            </div>
            <div className="analytics-chart-wrapper" style={{ height: 260 }}>
              {zoneBarData && chartData.zones.labels.length > 0
                ? <Bar data={zoneBarData} options={chartDefaults} />
                : <div className="empty-state"><p>No zone alerts recorded yet</p></div>
              }
            </div>
          </div>

          {/* Threat Trend */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3><TrendingUp size={16} /> Threat Detection & Resolution</h3>
            </div>
            <div className="analytics-chart-wrapper" style={{ height: 260 }}>
              {threatTrendData && <Line data={threatTrendData} options={chartDefaults} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
