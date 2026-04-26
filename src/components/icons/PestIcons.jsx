/**
 * PestIcons — Minimalist SVG icons for pest species
 * Replace emoji with crisp, scalable vector icons
 */

export function SnakeIcon({ size = 18, color = 'currentColor', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20c0-3 1.5-5 4-5h1c2.5 0 4-2 4-4s-1.5-4-4-4H8C5.5 7 4 5 4 3" />
      <circle cx="6" cy="3" r="1" fill={color} stroke="none" />
      <path d="M20 7c0 2-1 3.5-3 4" />
      <path d="M20 7c0-2-1-3.5-3-4" />
    </svg>
  );
}

export function CatIcon({ size = 18, color = 'currentColor', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7z" />
      <path d="M5 11l-1-6 4 3" />
      <path d="M19 11l1-6-4 3" />
      <circle cx="9.5" cy="13.5" r="1" fill={color} stroke="none" />
      <circle cx="14.5" cy="13.5" r="1" fill={color} stroke="none" />
      <path d="M10 17h4" />
    </svg>
  );
}

export function GeckoIcon({ size = 18, color = 'currentColor', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="8" rx="4" ry="3" />
      <circle cx="10.5" cy="7" r="0.5" fill={color} stroke="none" />
      <circle cx="13.5" cy="7" r="0.5" fill={color} stroke="none" />
      <path d="M12 11v3" />
      <path d="M12 14c-2 3-2 5-1 7" />
      <path d="M12 14c2 3 2 5 1 7" />
      <path d="M8 12l-2 1.5" />
      <path d="M16 12l2 1.5" />
      <path d="M8 16l-2 1" />
      <path d="M16 16l2 1" />
    </svg>
  );
}

// Generic pest icon (for unknown species)
export function PestIcon({ size = 18, color = 'currentColor', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="10" r="5" />
      <path d="M12 15v4" />
      <path d="M8 7l-2-3" />
      <path d="M16 7l2-3" />
      <path d="M7 10H3" />
      <path d="M21 10h-4" />
      <path d="M8 14l-3 2" />
      <path d="M16 14l3 2" />
    </svg>
  );
}

// Status dot — replaces 🟢🔴🟡
export function StatusDot({ status = 'online', size = 8 }) {
  const colors = {
    online: '#10b981',
    offline: '#ef4444',
    warning: '#f59e0b',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };
  const c = colors[status] || colors.online;
  return (
    <span
      className="status-dot-svg"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: c,
        boxShadow: `0 0 ${size}px ${c}60`,
        flexShrink: 0,
      }}
    />
  );
}

/**
 * Get the right icon component for a pest class name
 */
export function getPestIcon(className, size = 16, color) {
  const key = (className || '').toLowerCase();
  switch (key) {
    case 'snake': return <SnakeIcon size={size} color={color || '#d95459'} />;
    case 'cat': return <CatIcon size={size} color={color || '#e5a035'} />;
    case 'gecko':
    case 'lizard': return <GeckoIcon size={size} color={color || '#3db8a9'} />;
    default: return <PestIcon size={size} color={color || '#64748b'} />;
  }
}

/**
 * Inline SVG string for use in canvas drawing (DetectionPage)
 */
export function getPestLabel(className) {
  const key = (className || '').toLowerCase();
  switch (key) {
    case 'snake': return 'SNK';
    case 'cat': return 'CAT';
    case 'gecko':
    case 'lizard': return 'GKO';
    default: return 'PST';
  }
}
