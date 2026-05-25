import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const STEPS = [
  'Connecting to VAHAN database...',
  'Querying eChallan portal...',
  'Scanning accident & blacklist records...',
  'Running price intelligence engine...',
  'Generating AI report...',
];
const SAMPLE_PLATES = ['PB10BF1234','DL3CAF5678','HR26DQ9012','MH01AQ3456','KA05MJ7890'];

export default function Verify({ toast }) {
  const navigate = useNavigate();
  const [tab, setTab]           = useState('reg');
  const [regNo, setRegNo]       = useState('');
  const [askingPrice, setAsk]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);

  const analyze = async () => {
    if (!regNo.trim()) { toast('Please enter a registration number.','error'); return; }
    setLoading(true);
    setStepIdx(0);

    // Animate steps
    const timers = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStepIdx(i), i * 900));
    });

    try {
      const res = await api.post('/vehicles/analyze', {
        registrationNumber: regNo.trim().toUpperCase(),
        askingPrice: askingPrice ? Number(askingPrice) : 0
      });
      timers.forEach(clearTimeout);
      toast('Report generated successfully!','success');
      navigate(`/app/reports/${res.data.report._id}`);
    } catch (err) {
      timers.forEach(clearTimeout);
      toast(err.response?.data?.message || 'Analysis failed. Please try again.','error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding:28, animation:'fadeIn 0.4s ease' }}>
      {/* Search card */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:32, marginBottom:24 }}>
        <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:24, fontWeight:700, marginBottom:6 }}>Verify a Vehicle</h2>
        <p style={{ fontSize:14, color:'var(--text2)', marginBottom:24 }}>Enter the registration number to get a full history report with AI analysis.</p>

        {/* Tabs */}
        <div style={{ display:'flex', background:'var(--dark)', borderRadius:10, padding:4, width:'fit-content', marginBottom:24 }}>
          {[['reg','By Reg. Number'],['img','Upload Image']].map(([k,l]) => (
            <div key={k} onClick={() => setTab(k)}
              style={{ padding:'8px 20px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.2s',
                background:tab===k?'var(--gold)':'transparent', color:tab===k?'var(--dark)':'var(--text2)' }}>
              {l}
            </div>
          ))}
        </div>

        {tab === 'reg' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 200px 180px', gap:12, marginBottom:16 }}>
              <div>
                <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Registration Number</label>
                <input value={regNo} onChange={e => setRegNo(e.target.value.toUpperCase())}
                  placeholder="e.g. PB10BF1234" onKeyDown={e=>e.key==='Enter'&&analyze()}
                  style={{ letterSpacing:'1px', fontSize:15 }} maxLength={15} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Asking Price (₹) <span style={{ color:'var(--text3)' }}>optional</span></label>
                <input type="number" value={askingPrice} onChange={e => setAsk(e.target.value)}
                  placeholder="e.g. 475000" />
              </div>
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                <button onClick={analyze} disabled={loading}
                  style={{ width:'100%', background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'12px 20px', fontSize:14, fontWeight:700, fontFamily:'Rajdhani,sans-serif', letterSpacing:'0.5px', cursor:loading?'not-allowed':'pointer', opacity:loading?0.6:1, transition:'all 0.2s' }}
                  onMouseEnter={e=>!loading&&(e.currentTarget.style.background='var(--gold2)')}
                  onMouseLeave={e=>e.currentTarget.style.background='var(--gold)'}>
                  {loading ? 'Analyzing...' : 'Analyze Now'}
                </button>
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8 }}>Try a sample plate:</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {SAMPLE_PLATES.map(p => (
                  <div key={p} onClick={() => setRegNo(p)}
                    style={{ background:'var(--card2)', border:'1px solid var(--border)', borderRadius:6, padding:'5px 12px', fontFamily:'Rajdhani,sans-serif', fontSize:13, fontWeight:700, color:'var(--text2)', cursor:'pointer', letterSpacing:'0.5px', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)';}}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'img' && (
          <div style={{ border:'1.5px dashed var(--border)', borderRadius:12, padding:48, textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}
            onClick={() => toast('Image upload: connect a file parser in the backend routes','info')}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.background='var(--gold-dim)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='transparent';}}>
            <div style={{ fontSize:40, marginBottom:12 }}>📷</div>
            <p style={{ fontSize:14, color:'var(--text2)' }}><span style={{ color:'var(--gold)' }}>Click to upload</span> or drag & drop</p>
            <p style={{ fontSize:12, color:'var(--text3)', marginTop:6 }}>Vehicle photo, RC book, insurance paper · JPG, PNG, PDF up to 10MB</p>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:48, textAlign:'center' }}>
          <div style={{ width:48, height:48, border:'3px solid var(--border)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 20px' }} />
          <div style={{ fontSize:16, fontWeight:500, marginBottom:8 }}>Analyzing {regNo}...</div>
          <div style={{ fontSize:13, color:'var(--text2)', marginBottom:28 }}>{STEPS[stepIdx]}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:300, margin:'0 auto', textAlign:'left' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color: i < stepIdx ? 'var(--green)' : i === stepIdx ? 'var(--text)' : 'var(--text3)' }}>
                <div style={{ width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, flexShrink:0,
                  background: i < stepIdx ? 'var(--green-dim)' : i === stepIdx ? 'var(--gold-dim)' : 'var(--border)',
                  color: i < stepIdx ? 'var(--green)' : i === stepIdx ? 'var(--gold)' : 'var(--text3)' }}>
                  {i < stepIdx ? '✓' : i+1}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info box */}
      {!loading && (
        <div style={{ background:'var(--blue-dim)', border:'1px solid rgba(96,165,250,0.2)', borderRadius:12, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:500, color:'var(--blue)', marginBottom:8 }}>ℹ What does AutoVerify check?</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {['VAHAN Registration & RC','eChallan Portal (Paid & Pending)','Accident & Blacklist Records','Engine & Body Health Score','Real-Time Price Fairness','AI-Powered Verdict'].map(item => (
              <div key={item} style={{ fontSize:12, color:'var(--text2)', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'var(--green)' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
