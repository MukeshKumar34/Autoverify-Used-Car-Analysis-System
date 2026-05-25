import React from 'react';

export default function StatRow({ label, value, color }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize:13, color:'var(--text2)' }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:500, color: color || 'var(--text)' }}>{value}</span>
    </div>
  );
}
