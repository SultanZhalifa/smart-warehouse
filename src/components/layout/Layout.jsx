import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../common/ToastContainer';
import LiveEventSimulator from '../common/LiveEventSimulator';
import { useWarehouse } from '../../context/WarehouseContext';
import './Layout.css';

export default function Layout() {
  const { state } = useWarehouse();

  return (
    <div className={`app-layout ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
      <LiveEventSimulator />
    </div>
  );
}
