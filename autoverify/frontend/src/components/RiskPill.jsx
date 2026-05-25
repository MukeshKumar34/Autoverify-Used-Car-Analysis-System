import React from 'react';

const MAP = {
  low:      { bg:'var(--green-dim)', color:'var(--green)', label:'Low Risk' },
  moderate: { bg:'var(--gold-dim)',  color:'var(--gold)',  label:'Moderate Risk' },
  high:     { bg:'var(--red-dim)',   color:'var(--red)',   label:'High Risk' },
};

export default function RiskPill({ risk, score }) {
  const s = MAP[risk] || MAP.moderate;
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:52, fontWeight:700, color: risk==='low'?'var(--green)':risk==='high'?'var(--red)':'var(--gold)', lineHeight:1 }}>
        {score}
      </div>
      <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>Trust Score / 100</div>
      <div style={{ display:'inline-block', marginTop:7, padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, background:s.bg, color:s.color }}>
        {s.label}
      </div>
    </div>
  );
}
