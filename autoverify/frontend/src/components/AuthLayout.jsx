import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const BULLETS = [
  'Complete vehicle history from official government databases',
  'Engine health score & mileage verification',
  'Real-time price comparison across 50,000+ listings',
  'AI verdict with negotiation strategy',
  '3 free vehicle checks on signup — no card needed',
];

export default function AuthLayout({ children, title, subtitle, subtitleLink, subtitleLinkText, subtitleLinkTo }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      {/* Left panel */}
      <div style={{ background:'var(--panel)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:48, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, left:-100, width:400, height:400, background:'radial-gradient(circle,rgba(232,184,75,0.08) 0%,transparent 60%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', height:'100%' }}>
          <div style={{ marginBottom:48 }}><Logo /></div>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:36, fontWeight:700, lineHeight:1.2, marginBottom:16 }}>
            Don't buy blind.<br /><span style={{ color:'var(--gold)' }}>Verify first.</span>
          </div>
          <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.8, marginBottom:48 }}>
            Join 2.4 million buyers who made smarter decisions using AutoVerify's AI-powered vehicle intelligence platform.
          </p>
          <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:16 }}>
            {BULLETS.map(b => (
              <div key={b} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ width:20, height:20, background:'var(--gold-dim)', border:'1px solid rgba(232,184,75,0.4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  <div style={{ width:6, height:6, background:'var(--gold)', borderRadius:'50%' }} />
                </div>
                <span style={{ fontSize:14, color:'var(--text2)', lineHeight:1.6 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:48, background:'var(--dark)' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:30, fontWeight:700, marginBottom:8 }}>{title}</div>
          <div style={{ fontSize:14, color:'var(--text2)', marginBottom:36 }}>
            {subtitle}{' '}
            <span style={{ color:'var(--gold)', cursor:'pointer' }} onClick={() => navigate(subtitleLinkTo)}>
              {subtitleLinkText}
            </span>
          </div>
          {children}
          <div style={{ marginTop:20, textAlign:'center' }}>
            <button onClick={() => navigate('/')}
              style={{ background:'transparent', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:10, padding:'9px 20px', fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)';}}>
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
