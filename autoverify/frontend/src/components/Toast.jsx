import React from 'react';

const COLORS = { success:'#3dd68c', error:'#ef4444', info:'#60a5fa', warn:'#e8b84b' };

export default function Toast({ toasts }) {
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:'var(--card)', border:'1px solid var(--border)', borderRadius:12,
          padding:'13px 20px', display:'flex', alignItems:'center', gap:10,
          maxWidth:340, boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
          animation:'fadeIn 0.3s ease', fontSize:14, color:'var(--text)'
        }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[t.type]||COLORS.info, flexShrink:0 }} />
          {t.message}
        </div>
      ))}
    </div>
  );
}
