import React, { useEffect, useRef, useState } from 'react';

const getColor = (v) => v >= 80 ? 'var(--green)' : v >= 60 ? 'var(--gold)' : 'var(--red)';

export default function HealthBar({ label, value, color }) {
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; setTimeout(() => setWidth(value), 100); }
  }, [value]);
  const c = color || getColor(value);
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text2)', marginBottom:5 }}>
        <span>{label}</span>
        <span style={{ color:c, fontWeight:500 }}>{value}%</span>
      </div>
      <div style={{ height:7, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${width}%`, background:c, borderRadius:4, transition:'width 1.1s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  );
}
