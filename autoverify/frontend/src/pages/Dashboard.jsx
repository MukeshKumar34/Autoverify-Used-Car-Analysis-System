import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const RISK_PILL = { low:['var(--green-dim)','var(--green)','Low Risk'], moderate:['var(--gold-dim)','var(--gold)','Moderate Risk'], high:['var(--red-dim)','var(--red)','High Risk'] };

export default function Dashboard({ toast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]   = useState({ totalChecks:0, checksRemaining:0, safeVehicles:0, fraudCaught:0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/users/stats'), api.get('/vehicles/history')])
      .then(([s, h]) => { setStats(s.data.stats); setRecent(h.data.reports.slice(0,5)); })
      .catch(() => toast('Could not load dashboard data.','error'))
      .finally(() => setLoading(false));
  }, []);

  const KPI = [
    { label:'Total Checks', value:stats.totalChecks, color:'var(--gold)' },
    { label:'Safe Vehicles', value:stats.safeVehicles, color:'var(--green)' },
    { label:'Fraud Caught', value:stats.fraudCaught, color:'var(--red)' },
    { label:'Checks Left', value:stats.checksRemaining, color:'var(--blue)' },
  ];

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});

  return (
    <div style={{ padding:28, animation:'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:26, fontWeight:700 }}>
          Good morning, {user?.firstName} 👋
        </h2>
        <p style={{ color:'var(--text2)', fontSize:14, marginTop:4 }}>Here's your vehicle verification activity overview.</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        {KPI.map(k => (
          <div key={k.label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:20 }}>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:34, fontWeight:700, color:k.color }}>
              {loading ? '—' : k.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Recent checks */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:20 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:15, fontWeight:600, marginBottom:16 }}>📋 Recent Checks</div>
          {loading && <div style={{ color:'var(--text3)', fontSize:13 }}>Loading...</div>}
          {!loading && recent.length === 0 && (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ fontSize:13, color:'var(--text3)', marginBottom:12 }}>No verifications yet</div>
              <button onClick={() => navigate('/app/verify')}
                style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:8, padding:'9px 20px', fontSize:13, fontWeight:600, fontFamily:'Rajdhani,sans-serif', cursor:'pointer' }}>
                Verify First Vehicle
              </button>
            </div>
          )}
          {recent.map(r => {
            const rp = RISK_PILL[r.riskLevel] || RISK_PILL.moderate;
            return (
              <div key={r._id} onClick={() => navigate(`/app/reports/${r._id}`)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}>
                <div style={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:5, padding:'3px 8px', fontFamily:'Rajdhani,sans-serif', fontSize:13, fontWeight:700, color:'var(--gold)', letterSpacing:'0.5px', flexShrink:0 }}>
                  {r.registrationNumber}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13 }}>{r.vehicleDetails?.make} {r.vehicleDetails?.model} {r.vehicleDetails?.year}</p>
                  <small style={{ fontSize:11, color:'var(--text2)' }}>{fmt(r.createdAt)}</small>
                </div>
                <div style={{ background:rp[0], color:rp[1], padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>
                  {r.trustScore}/100
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:20 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:15, fontWeight:600, marginBottom:16 }}>⚡ Quick Actions</div>
          {[
            { icon:'🔍', label:'Verify a New Vehicle', desc:'Enter reg number or upload image', action:()=>navigate('/app/verify'), gold:true },
            { icon:'📄', label:'View All Reports',      desc:'Browse your verification history',action:()=>navigate('/app/reports') },
            { icon:'⭐', label:'Upgrade to Pro',        desc:'Get 30 checks per month',         action:()=>navigate('/app/plans') },
            { icon:'👤', label:'Update Profile',        desc:'Edit your info & notifications',   action:()=>navigate('/app/profile') },
          ].map(a => (
            <div key={a.label} onClick={a.action}
              style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', borderRadius:10, cursor:'pointer', marginBottom:6, border:`1px solid ${a.gold?'rgba(232,184,75,0.3)':'var(--border)'}`, background:a.gold?'var(--gold-dim)':'transparent', transition:'all 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--gold)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor=a.gold?'rgba(232,184,75,0.3)':'var(--border)'}>
              <span style={{ fontSize:20 }}>{a.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:a.gold?'var(--gold)':'var(--text)' }}>{a.label}</div>
                <div style={{ fontSize:11, color:'var(--text3)' }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop:20 }}>
        <button onClick={() => navigate('/app/verify')}
          style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:700, fontFamily:'Rajdhani,sans-serif', letterSpacing:'0.5px', cursor:'pointer', transition:'background 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--gold2)'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--gold)'}>
          + Verify a New Vehicle
        </button>
      </div>
    </div>
  );
}
