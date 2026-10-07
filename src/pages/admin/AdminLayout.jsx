import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminAuthGate from './AdminAuthGate';

const S = {
  bg: '#fffaf3',
  t1: '#0f172a',
};

export default function AdminLayout() {
  return (
    <AdminAuthGate>
      <div style={{ display:'flex', height:'100vh', width:'100vw', overflow:'hidden', background:S.bg, position:'fixed', top:0, left:0, fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", color:S.t1 }}>
        <AdminSidebar />
        <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'#fffaf3' }}>
          <Outlet />
        </main>
      </div>
    </AdminAuthGate>
  );
}
