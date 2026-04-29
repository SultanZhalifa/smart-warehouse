import { useWarehouse } from '../../context/WarehouseContext';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: XCircle,
};

const colors = {
  success: 'var(--color-accent-success)',
  warning: 'var(--color-accent-warning)',
  info: 'var(--color-accent-info)',
  error: 'var(--color-accent-danger)',
};

export default function ToastContainer() {
  const { state, dispatch } = useWarehouse();

  return (
    <div className="toast-container">
      {state.toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={18} style={{ color: colors[toast.type], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 2 }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
              style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
