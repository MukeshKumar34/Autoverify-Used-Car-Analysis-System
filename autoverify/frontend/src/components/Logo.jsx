import React from 'react';

export default function Logo({ size = 'md' }) {
  const iconPx  = size === 'sm' ? 32 : 40;
  const textPx  = size === 'sm' ? 20 : 24;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{
        width:iconPx, height:iconPx, background:'var(--gold)', borderRadius:9,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
      }}>
        <svg viewBox="0 0 24 24" width={iconPx*0.54} height={iconPx*0.54} fill="#09090f">
          <path d="M12 2L2 7l1 10 9 5 9-5 1-10z"/>
        </svg>
      </div>
      <span style={{ fontFamily:'Rajdhani,sans-serif', fontSize:textPx, fontWeight:700, letterSpacing:'1.5px', color:'var(--text)' }}>
        AUTO<span style={{ color:'var(--gold)' }}>VERIFY</span>
      </span>
    </div>
  );
}
