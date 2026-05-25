import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const FEATURES = [
  { icon:'🔍', color:'var(--gold-dim)', title:'Instant RC & Owner Verification', desc:'Cross-check registration, ownership history, and RTO records directly from VAHAN database in real-time.' },
  { icon:'🚨', color:'var(--red-dim)',  title:'Challan & Legal History',          desc:'Find all pending and paid challans from eChallan portal. Know all legal liabilities before money changes hands.' },
  { icon:'💰', color:'var(--green-dim)',title:'AI Price Fairness Engine',          desc:'Our algorithm compares asking price against 50,000+ real-time transactions to tell you if you are overcharged.' },
  { icon:'⚙️', color:'var(--blue-dim)', title:'Engine Health Score',              desc:'Detailed engine, transmission, body, and interior condition scores so you know exactly what you are buying.' },
  { icon:'📋', color:'var(--gold-dim)', title:'Full Accident History',             desc:'Check for accident records, flood damage, salvage title, and blacklisting across national databases.' },
  { icon:'🤖', color:'var(--green-dim)',title:'AI-Powered Verdict',               desc:'Get a plain-language recommendation with negotiation tips so you can confidently make your offer.' },
];

const STATS = [['2.4M+','Vehicles Verified'],['98.7%','Accuracy Rate'],['₹340Cr+','Fraud Prevented'],['4.9★','User Rating']];

export default function Landing() {
  const navigate = useNavigate();
  const [showTeamSection, setShowTeamSection] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', overflow:'hidden' }}>
      {/* BG Effects */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:600, height:600, background:'radial-gradient(circle,rgba(232,184,75,0.07) 0%,transparent 70%)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:500, height:500, background:'radial-gradient(circle,rgba(61,214,140,0.05) 0%,transparent 70%)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
      </div>

      {/* Nav */}
      <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 60px', borderBottom:'1px solid var(--border)' }}>
        <Logo />
        <div style={{ display:'flex', alignItems:'center', gap:32 }}>
          {['How It Works','Features','Pricing'].map(l => {
            const sectionId = l.toLowerCase().replace(/\s+/g, '-');
            return (
              <span key={l} onClick={() => scrollToSection(sectionId)} style={{ color:'var(--text2)', fontSize:14, cursor:'pointer', transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='var(--gold)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}>{l}</span>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => navigate('/login')}
            style={{ background:'transparent', color:'var(--text)', border:'1px solid var(--border2)', borderRadius:10, padding:'10px 24px', fontSize:14, transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text)';}}>
            Login
          </button>
          <button onClick={() => navigate('/signup')}
            style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'10px 24px', fontSize:14, fontWeight:600, fontFamily:'Rajdhani,sans-serif', letterSpacing:'0.5px', transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--gold2)'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--gold)'}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position:'relative', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'80px 40px 60px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--gold-dim)', border:'1px solid rgba(232,184,75,0.3)', borderRadius:20, padding:'6px 16px', fontSize:12, color:'var(--gold)', marginBottom:32, letterSpacing:'0.5px' }}>
          <span style={{ width:6, height:6, background:'var(--gold)', borderRadius:'50%', animation:'pulse 2s infinite', display:'inline-block' }} />
          India's Most Trusted Vehicle Verification Platform
        </div>
        <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'clamp(44px,7vw,88px)', fontWeight:700, lineHeight:1.0, letterSpacing:'-1px', marginBottom:24 }}>
          Know the <span style={{ color:'var(--gold)' }}>Truth</span><br />Before You Buy
        </h1>
        <p style={{ fontSize:18, color:'var(--text2)', maxWidth:580, lineHeight:1.7, marginBottom:48 }}>
          Instant used car verification — engine health, challan history, accident records, price fairness, and AI-powered verdict in seconds.
        </p>
        <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
          <button onClick={() => navigate('/signup')}
            style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'16px 44px', fontSize:16, fontWeight:700, fontFamily:'Rajdhani,sans-serif', letterSpacing:'0.5px', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--gold2)'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--gold)'}>
            Start Free Verification
          </button>
          <button onClick={() => navigate('/login')}
            style={{ background:'transparent', color:'var(--text)', border:'1px solid var(--border2)', borderRadius:10, padding:'16px 44px', fontSize:16, cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text)';}}>
            I have an account
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:60, marginTop:72, paddingTop:48, borderTop:'1px solid var(--border)', flexWrap:'wrap', justifyContent:'center' }}>
          {STATS.map(([num,label]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:36, fontWeight:700, color:'var(--gold)' }}>{num}</div>
              <div style={{ fontSize:13, color:'var(--text2)', marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Overview */}
      <div style={{ position:'relative', zIndex:5, borderTop:'1px solid var(--border)', background:'var(--panel)', padding:'80px 60px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
          <div>
            <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:36, fontWeight:700, marginBottom:20, lineHeight:1.2, color:'var(--text)' }}>
              Complete Vehicle Intelligence <br /><span style={{ color:'var(--gold)' }}>Simplified For Everyone</span>
            </h2>
            <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.8, marginBottom:20 }}>
              Buying a pre-owned vehicle in India has historically been filled with uncertainty. Between hidden structural damages, odometer tampering, outstanding court cases, and unfair pricing, buyers face massive risks.
            </p>
            <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.8, marginBottom:28 }}>
              AutoVerify aggregates millions of data points instantly. By bridging direct connections to government registries, national crime databases, transport directories, and legal courts, we map out the complete history of any vehicle. Supported by our trained machine learning models, we analyze pricing trends and technical condition scores to put you in complete control.
            </p>
            <div style={{ display:'flex', gap:16 }}>
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:16, flex:1 }}>
                <div style={{ fontSize:20, marginBottom:8 }}>📊</div>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:4, fontFamily:'Rajdhani,sans-serif', color:'var(--text)' }}>Proprietary Index</div>
                <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5 }}>Multi-factored scoring grading overall structural, legal, and financial status.</div>
              </div>
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:16, flex:1 }}>
                <div style={{ fontSize:20, marginBottom:8 }}>⚖️</div>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:4, fontFamily:'Rajdhani,sans-serif', color:'var(--text)' }}>Absolute Compliance</div>
                <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5 }}>100% compliant and secure platform pulling original registered datasets.</div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview Card */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:28, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, right:0, width:150, height:150, background:'radial-gradient(circle,rgba(232,184,75,0.06) 0%,transparent 70%)' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border)', paddingBottom:16, marginBottom:20 }}>
              <div>
                <span style={{ fontSize:11, color:'var(--gold)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>Sample Analysis Check</span>
                <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, marginTop:2, color:'var(--text)' }}>Honda City ZX i-VTEC</h4>
              </div>
              <div style={{ background:'var(--green-dim)', border:'1px solid var(--green)', borderRadius:8, color:'var(--green)', padding:'4px 10px', fontSize:11, fontWeight:700 }}>
                92 Trust Score
              </div>
            </div>
            
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'var(--text2)' }}>✓ RTO Registration</span>
                <span style={{ fontWeight:600, color:'var(--green)' }}>GENUINE MATCH</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'var(--text2)' }}>✓ Financial Encumbrances</span>
                <span style={{ fontWeight:600, color:'var(--green)' }}>NO LOAN DETECTED</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'var(--text2)' }}>✓ Pending Traffic Fines</span>
                <span style={{ fontWeight:600, color:'var(--gold)' }}>2 PAID · 0 PENDING</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'var(--text2)' }}>✓ Market Price Fairness</span>
                <span style={{ fontWeight:600, color:'var(--green)' }}>FAIR BUYING VALUE</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'var(--text2)' }}>✓ Blacklist & Theft Check</span>
                <span style={{ fontWeight:600, color:'var(--green)' }}>CLEAN REGISTRY</span>
              </div>
            </div>
            
            <div style={{ marginTop:24, background:'var(--border)', height:1, width:'100%' }} />
            
            <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ fontSize:22 }}>🤖</div>
              <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5 }}>
                <strong style={{ color:'var(--text)' }}>AI Recommendation:</strong> Strong purchase. Highly competitive asking price with outstanding mechanical grades.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" style={{ position:'relative', zIndex:5, borderTop:'1px solid var(--border)', background:'var(--dark)', padding:'80px 60px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', textAlign:'center', marginBottom:48 }}>
          <span style={{ fontSize:11, color:'var(--gold)', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>Simple Verification Process</span>
          <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:36, fontWeight:700, marginTop:8, color:'var(--text)' }}>How AutoVerify Works</h2>
        </div>
        
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:28, position:'relative' }}>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:44, fontWeight:700, color:'rgba(232,184,75,0.08)', position:'absolute', right:24, top:16 }}>01</div>
            <div style={{ width:40, height:40, borderRadius:8, background:'var(--gold-dim)', color:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, marginBottom:20 }}>⌨️</div>
            <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:18, fontWeight:600, marginBottom:10, color:'var(--text)' }}>Enter Vehicle Number</h4>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
              Provide the state-registered license plate code of any car or two-wheeler. Our system natively processes registrations across all Indian states and Union Territories.
            </p>
          </div>
          
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:28, position:'relative' }}>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:44, fontWeight:700, color:'rgba(96,165,250,0.08)', position:'absolute', right:24, top:16 }}>02</div>
            <div style={{ width:40, height:40, borderRadius:8, background:'var(--blue-dim)', color:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, marginBottom:20 }}>⚡</div>
            <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:18, fontWeight:600, marginBottom:10, color:'var(--text)' }}>Real-Time Scanning</h4>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
              AutoVerify establishes direct secure tunnels to central government registries (VAHAN), municipal traffic courts, insurance agencies, and pricing indexes to build a complete profile.
            </p>
          </div>
          
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:28, position:'relative' }}>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:44, fontWeight:700, color:'rgba(61,214,140,0.08)', position:'absolute', right:24, top:16 }}>03</div>
            <div style={{ width:40, height:40, borderRadius:8, background:'var(--green-dim)', color:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, marginBottom:20 }}>📈</div>
            <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:18, fontWeight:600, marginBottom:10, color:'var(--text)' }}>Interactive Verdict</h4>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
              Access an easy-to-read diagnostic breakdown including legal blacklists, pricing ranges, transmission scores, accident data, and a plain-language summary with negotiation pointers.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--border)', borderTop:'1px solid var(--border)', position:'relative', zIndex:5 }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ background:'var(--dark)', padding:36, transition:'background 0.2s', cursor:'default' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--panel)'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--dark)'}>
            <div style={{ width:44, height:44, borderRadius:10, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:18 }}>{f.icon}</div>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:18, fontWeight:600, marginBottom:10 }}>{f.title}</div>
            <div style={{ fontSize:14, color:'var(--text2)', lineHeight:1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Pricing Section */}
      <div id="pricing" style={{ position:'relative', zIndex:5, borderTop:'1px solid var(--border)', background:'var(--dark)', padding:'80px 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', textAlign:'center', marginBottom:48 }}>
          <span style={{ fontSize:11, color:'var(--gold)', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>Simple Premium Plans</span>
          <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:36, fontWeight:700, marginTop:8, color:'var(--text)' }}>Flexible Pricing Tiers</h2>
          <p style={{ fontSize:14, color:'var(--text2)', maxWidth:560, margin:'10px auto 0', lineHeight:1.6 }}>
            Pick the perfect plan for your vehicle inspection needs. Scale up or down anytime.
          </p>
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:28 }}>
          {/* Free Tier */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:32, position:'relative' }}>
            <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:22, fontWeight:700, marginBottom:4, color:'var(--text)' }}>Free Plan</h4>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:18 }}>For occasional private buyers</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:20 }}>
              <span style={{ fontFamily:'Rajdhani,sans-serif', fontSize:38, fontWeight:700, color:'var(--gold)' }}>₹0</span>
              <span style={{ fontSize:13, color:'var(--text2)' }}>/ forever free</span>
            </div>
            
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, marginBottom:32, padding:0 }}>
              {['3 vehicle checks / month', 'Basic registration info', 'Challan history lookup', 'Price fairness analysis'].map(f => (
                <li key={f} style={{ fontSize:13, color:'var(--text2)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'var(--green)', fontWeight:700 }}>✓</span> {f}
                </li>
              ))}
              {['Engine health score', 'AI verdict reports'].map(f => (
                <li key={f} style={{ fontSize:13, color:'var(--text3)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'var(--text3)', fontWeight:700 }}>✗</span> {f}
                </li>
              ))}
            </ul>
            
            <button onClick={() => navigate('/signup')}
              style={{ width:'100%', background:'transparent', color:'var(--text)', border:'1px solid var(--border2)', borderRadius:10, padding:12, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--gold)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}>
              Get Started Free
            </button>
          </div>

          {/* Pro Tier (Popular) */}
          <div style={{ background:'var(--gold-dim)', border:'1px solid rgba(232,184,75,0.4)', borderRadius:18, padding:32, position:'relative' }}>
            <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'var(--dark)', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:20 }}>
              MOST POPULAR
            </div>
            <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:22, fontWeight:700, marginBottom:4, color:'var(--gold)' }}>Pro Plan</h4>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:18 }}>For serious buyers & dealers</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:20 }}>
              <span style={{ fontFamily:'Rajdhani,sans-serif', fontSize:38, fontWeight:700, color:'var(--gold)' }}>₹299</span>
              <span style={{ fontSize:13, color:'var(--text2)' }}>/ month</span>
            </div>
            
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, marginBottom:32, padding:0 }}>
              {['30 vehicle checks / month', 'Full registration history', 'Challan & accident history', 'Price fairness engine', 'Engine & technical health score', 'AI verdict & negotiation tips', 'PDF export reports'].map(f => (
                <li key={f} style={{ fontSize:13, color:'var(--text)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'var(--green)', fontWeight:700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            
            <button onClick={() => navigate('/signup')}
              style={{ width:'100%', background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:12, fontSize:13, fontWeight:700, fontFamily:'Rajdhani,sans-serif', letterSpacing:'0.5px', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--gold2)'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--gold)'}>
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Tier */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:32, position:'relative' }}>
            <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:22, fontWeight:700, marginBottom:4, color:'var(--text)' }}>Enterprise Plan</h4>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:18 }}>For dealerships & high volume buyers</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:20 }}>
              <span style={{ fontFamily:'Rajdhani,sans-serif', fontSize:38, fontWeight:700, color:'var(--gold)' }}>₹999</span>
              <span style={{ fontSize:13, color:'var(--text2)' }}>/ month</span>
            </div>
            
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, marginBottom:32, padding:0 }}>
              {['Unlimited vehicle checks', 'Full registration history', 'Challan & accident history', 'Price fairness engine', 'Engine & technical health score', 'AI verdict + negotiation tips', 'PDF & bulk export tool', '24/7 dedicated priority support'].map(f => (
                <li key={f} style={{ fontSize:13, color:'var(--text2)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'var(--green)', fontWeight:700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            
            <button onClick={() => navigate('/signup')}
              style={{ width:'100%', background:'transparent', color:'var(--text)', border:'1px solid var(--border2)', borderRadius:10, padding:12, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--gold)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Project Team Section (situated at the bottom above the footer) */}
      <div style={{ position:'relative', zIndex:5, borderTop:'1px solid var(--border)', background:'var(--panel)', padding:'60px 40px', textAlign:'center' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <span style={{ fontSize:11, color:'var(--gold)', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>Academic Collaboration Details</span>
          <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:32, fontWeight:700, marginTop:8, marginBottom:12, color:'var(--text)' }}>AutoVerify Development Team</h2>
          <p style={{ fontSize:14, color:'var(--text2)', maxWidth:640, margin:'0 auto 24px', lineHeight:1.6 }}>
            This platform was built as a collaborative group project. Click the button below to view the project leaders, frontend designers, backend engineers, and QA testers.
          </p>
          
          <button onClick={() => setShowTeamSection(!showTeamSection)}
            style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'12px 36px', fontSize:14, fontWeight:700, fontFamily:'Rajdhani,sans-serif', cursor:'pointer', transition:'all 0.2s', boxShadow:'0 4px 12px rgba(232,184,75,0.15)' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--gold2)'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--gold)'}>
            {showTeamSection ? 'Hide Contributors Details' : 'Show Contributors Details'}
          </button>

          {/* Expanded Team Grid */}
          {showTeamSection && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20, marginTop:40, textAlign:'left', animation:'fadeIn 0.4s ease' }}>
              {/* Mukesh */}
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:24, position:'relative' }}>
                <div style={{ fontSize:28, marginBottom:16 }}>👑</div>
                <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, color:'var(--gold)', marginBottom:4 }}>Mukesh Kumar</h4>
                <div style={{ fontSize:12, color:'var(--text)', fontWeight:600, marginBottom:12 }}>Project Lead & Architect</div>
                <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
                  Responsible for the general architecture, database modeling, timeline management, and overall system design/integration.
                </p>
              </div>

              {/* Sourabh */}
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:24, position:'relative' }}>
                <div style={{ fontSize:28, marginBottom:16 }}>🎨</div>
                <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, color:'var(--blue)', marginBottom:4 }}>Sourabh Siwach</h4>
                <div style={{ fontSize:12, color:'var(--text)', fontWeight:600, marginBottom:12 }}>Frontend UI/UX Specialist</div>
                <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
                  Creates and styles the responsive client layouts, variables, dark mode styling, and dynamic PDF export features.
                </p>
              </div>

              {/* Nidhi */}
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:24, position:'relative' }}>
                <div style={{ fontSize:28, marginBottom:16 }}>🔌</div>
                <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, color:'var(--green)', marginBottom:4 }}>Nidhi Rana</h4>
                <div style={{ fontSize:12, color:'var(--text)', fontWeight:600, marginBottom:12 }}>Backend & API Engineer</div>
                <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
                  Develops the backend REST API, JWT user authentication middleware, and optimizes algorithmic vehicle analysis scoring.
                </p>
              </div>

              {/* Neha */}
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:24, position:'relative' }}>
                <div style={{ fontSize:28, marginBottom:16 }}>🛡️</div>
                <h4 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, color:'var(--red)', marginBottom:4 }}>Neha Karnawal</h4>
                <div style={{ fontSize:12, color:'var(--text)', fontWeight:600, marginBottom:12 }}>Database & QA Tester</div>
                <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
                  Manages MongoDB database schemas, validations, runs integration tests, and performs QA verification testing.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop:'1px solid var(--border)', padding:'28px 60px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:5 }}>
        <Logo size="sm" />
        <span style={{ fontSize:13, color:'var(--text3)' }}>© 2024 AutoVerify. Built for smarter used car buying in India.</span>
      </div>
    </div>
  );
}
