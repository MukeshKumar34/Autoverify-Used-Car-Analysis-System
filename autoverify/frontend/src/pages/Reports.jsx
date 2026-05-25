import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const RISK_MAP = { low:['var(--green-dim)','var(--green)','Low Risk'], moderate:['var(--gold-dim)','var(--gold)','Moderate Risk'], high:['var(--red-dim)','var(--red)','High Risk'] };

export default function Reports({ toast }) {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports')
      .then(res => setReports(res.data.reports))
      .catch(() => toast('Could not load reports.','error'))
      .finally(() => setLoading(false));
  }, []);

  const deleteReport = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(prev => prev.filter(r => r._id !== id));
      toast('Report deleted.','success');
    } catch { toast('Delete failed.','error'); }
  };

  const fmt = d => new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});

  return (
    <div style={{ padding:28, animation:'fadeIn 0.4s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:22, fontWeight:700 }}>My Reports</h2>
          <p style={{ color:'var(--text2)', fontSize:13, marginTop:4 }}>{reports.length} verification{reports.length!==1?'s':''} total</p>
        </div>
        <button onClick={() => navigate('/app/verify')}
          style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'10px 22px', fontSize:13, fontWeight:700, fontFamily:'Rajdhani,sans-serif', cursor:'pointer' }}>
          + New Verification
        </button>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:60 }}>
          <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:60, textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:16 }}>📋</div>
          <h3 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:600, marginBottom:8 }}>No reports yet</h3>
          <p style={{ color:'var(--text2)', fontSize:14, marginBottom:24 }}>Verify your first vehicle to see the full analysis here.</p>
          <button onClick={() => navigate('/app/verify')}
            style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'11px 28px', fontSize:14, fontWeight:700, fontFamily:'Rajdhani,sans-serif', cursor:'pointer' }}>
            Verify a Vehicle
          </button>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {reports.map(r => {
            const rp = RISK_MAP[r.riskLevel] || RISK_MAP.moderate;
            return (
              <div key={r._id} onClick={() => navigate(`/app/reports/${r._id}`)}
                style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'18px 20px', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:16 }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                {/* Plate */}
                <div style={{ background:'var(--card2)', border:'1px solid var(--gold)', borderRadius:8, padding:'6px 14px', fontFamily:'Rajdhani,sans-serif', fontSize:15, fontWeight:700, color:'var(--gold)', letterSpacing:'1px', flexShrink:0 }}>
                  {r.registrationNumber}
                </div>
                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{r.vehicleDetails?.make} {r.vehicleDetails?.model} {r.vehicleDetails?.variant}</div>
                  <div style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>{r.vehicleDetails?.year} · {r.vehicleDetails?.fuelType} · {r.vehicleDetails?.city} · Verified {fmt(r.createdAt)}</div>
                </div>
                {/* Score */}
                <div style={{ textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, color:rp[1] }}>{r.trustScore}</div>
                  <div style={{ fontSize:10, color:'var(--text3)' }}>/ 100</div>
                </div>
                {/* Risk pill */}
                <div style={{ background:rp[0], color:rp[1], padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, flexShrink:0 }}>{rp[2]}</div>
                {/* Delete */}
                <button onClick={e => deleteReport(r._id, e)}
                  style={{ background:'transparent', border:'none', color:'var(--text3)', fontSize:18, cursor:'pointer', padding:'4px 8px', borderRadius:6, flexShrink:0, transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--red)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
