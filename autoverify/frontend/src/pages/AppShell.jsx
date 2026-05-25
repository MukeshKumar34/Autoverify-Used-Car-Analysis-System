import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import Verify    from './Verify';
import Reports   from './Reports';
import ReportDetail from './ReportDetail';
import Profile   from './Profile';
import Plans     from './Plans';

const TITLES = {
  '/app/dashboard': 'Dashboard',
  '/app/verify':    'Verify Vehicle',
  '/app/reports':   'My Reports',
  '/app/profile':   'Profile & Settings',
  '/app/plans':     'Plans & Billing',
};

export default function AppShell({ toast }) {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'AutoVerify';

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
        {/* Top bar */}
        <div style={{ background:'var(--panel)', borderBottom:'1px solid var(--border)', padding:'16px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:600 }}>{title}</div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ background:'var(--gold-dim)', border:'1px solid rgba(232,184,75,0.3)', color:'var(--gold)', fontSize:11, padding:'4px 12px', borderRadius:20 }}>Free Plan</div>
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:8, cursor:'pointer', position:'relative' }}>
              🔔
              <div style={{ position:'absolute', top:6, right:6, width:7, height:7, background:'var(--red)', borderRadius:'50%' }} />
            </div>
          </div>
        </div>

        {/* Pages */}
        <div style={{ flex:1 }}>
          <Routes>
            <Route path="dashboard" element={<Dashboard toast={toast} />} />
            <Route path="verify"    element={<Verify toast={toast} />} />
            <Route path="reports"   element={<Reports toast={toast} />} />
            <Route path="reports/:id" element={<ReportDetail toast={toast} />} />
            <Route path="profile"   element={<Profile toast={toast} />} />
            <Route path="plans"     element={<Plans toast={toast} />} />
            <Route path="*"         element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
