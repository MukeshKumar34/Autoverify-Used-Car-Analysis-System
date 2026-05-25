import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const NAV = [
  { to:'/app/dashboard', icon:'⊞', label:'Dashboard' },
  { to:'/app/verify',    icon:'◎', label:'Verify Vehicle' },
  { to:'/app/reports',   icon:'◧', label:'My Reports' },
  { to:'/app/profile',   icon:'◯', label:'Profile & Settings' },
  { to:'/app/plans',     icon:'◈', label:'Plans & Billing' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user ? `${user.firstName?.[0]||''}${user.lastName?.[0]||''}`.toUpperCase() : 'U';
  const planChecks = { free:'3 checks left', pro:'30 checks/mo', enterprise:'Unlimited' };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ width:240, minHeight:'100vh', background:'var(--panel)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky', top:0, height:'100vh' }}>
      {/* Logo */}
      <div style={{ padding:'22px 20px', borderBottom:'1px solid var(--border)' }}>
        <Logo size="sm" />
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 10px', overflowY:'auto' }}>
        <div style={{ fontSize:10, color:'var(--text3)', letterSpacing:'1px', textTransform:'uppercase', padding:'10px 10px 6px' }}>Main</div>
        {NAV.slice(0,3).map(n => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
            borderRadius:10, color: isActive ? 'var(--gold)' : 'var(--text2)',
            background: isActive ? 'var(--gold-dim)' : 'transparent',
            textDecoration:'none', fontSize:14, marginBottom:2, transition:'all 0.15s'
          })}>
            <span style={{ fontSize:16 }}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
        <div style={{ fontSize:10, color:'var(--text3)', letterSpacing:'1px', textTransform:'uppercase', padding:'14px 10px 6px' }}>Account</div>
        {NAV.slice(3).map(n => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
            borderRadius:10, color: isActive ? 'var(--gold)' : 'var(--text2)',
            background: isActive ? 'var(--gold-dim)' : 'transparent',
            textDecoration:'none', fontSize:14, marginBottom:2, transition:'all 0.15s'
          })}>
            <span style={{ fontSize:16 }}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding:'16px', borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:'var(--gold)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:15, color:'var(--dark)', flexShrink:0 }}>
            {initials}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </div>
            <div style={{ fontSize:11, color:'var(--gold)' }}>
              {user?.plan ? user.plan.charAt(0).toUpperCase()+user.plan.slice(1) : 'Free'} · {planChecks[user?.plan||'free']}
            </div>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ background:'none', border:'none', color:'var(--text3)', padding:4, borderRadius:6, cursor:'pointer', transition:'color 0.2s', fontSize:16 }}
            onMouseEnter={e=>e.target.style.color='var(--red)'}
            onMouseLeave={e=>e.target.style.color='var(--text3)'}>
            ⎋
          </button>
        </div>
      </div>
    </div>
  );
}
