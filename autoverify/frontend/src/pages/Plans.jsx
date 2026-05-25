import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PLANS = [
  {
    key:'free', name:'Free', price:'₹0', period:'Forever free',
    desc:'For occasional buyers',
    features:[
      { text:'3 vehicle checks / month', ok:true },
      { text:'Basic registration info', ok:true },
      { text:'Challan history', ok:true },
      { text:'Price fairness check', ok:true },
      { text:'Engine health score', ok:false },
      { text:'AI verdict report', ok:false },
      { text:'PDF export', ok:false },
      { text:'Priority support', ok:false },
    ]
  },
  {
    key:'pro', name:'Pro', price:'₹299', period:'per month',
    desc:'For serious buyers & dealers', popular:true,
    features:[
      { text:'30 vehicle checks / month', ok:true },
      { text:'Full registration history', ok:true },
      { text:'Challan + accident history', ok:true },
      { text:'Price fairness engine', ok:true },
      { text:'Engine health score', ok:true },
      { text:'AI verdict + negotiation tips', ok:true },
      { text:'PDF export', ok:true },
      { text:'Priority support', ok:false },
    ]
  },
  {
    key:'enterprise', name:'Enterprise', price:'₹999', period:'per month',
    desc:'For dealerships & bulk buyers',
    features:[
      { text:'Unlimited vehicle checks', ok:true },
      { text:'Full registration history', ok:true },
      { text:'Challan + accident history', ok:true },
      { text:'Price fairness engine', ok:true },
      { text:'Engine health score', ok:true },
      { text:'AI verdict + negotiation tips', ok:true },
      { text:'PDF export + bulk export', ok:true },
      { text:'24/7 priority support', ok:true },
    ]
  }
];

export default function Plans({ toast }) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');

  const upgrade = async (plan) => {
    if (plan === user?.plan) { toast('You are already on this plan.','info'); return; }
    setLoading(plan);
    try {
      const res = await api.put('/users/upgrade', { plan });
      updateUser(res.data.user);
      toast(res.data.message, 'success');
      navigate('/app/dashboard');
    } catch (err) { toast(err.response?.data?.message || 'Upgrade failed.','error'); }
    finally { setLoading(''); }
  };

  return (
    <div style={{ padding:28, animation:'fadeIn 0.4s ease' }}>
      <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:26, fontWeight:700 }}>Plans & Billing</h2>
      <p style={{ color:'var(--text2)', fontSize:14, marginTop:6 }}>Choose the plan that fits your usage. Upgrade or downgrade anytime.</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginTop:28 }}>
        {PLANS.map(p => {
          const isCurrent = user?.plan === p.key;
          return (
            <div key={p.key} style={{
              background: p.popular ? 'var(--gold-dim)' : 'var(--card)',
              border: `1px solid ${p.popular ? 'rgba(232,184,75,0.4)' : 'var(--border)'}`,
              borderRadius:16, padding:28, position:'relative'
            }}>
              {p.popular && (
                <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'var(--dark)', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:20, whiteSpace:'nowrap' }}>
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div style={{ position:'absolute', top:-12, right:20, background:'var(--green)', color:'#fff', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>
                  Current Plan
                </div>
              )}
              <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'var(--text2)', marginBottom:14 }}>{p.desc}</div>
              <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:38, fontWeight:700, color:'var(--gold)' }}>{p.price}</div>
              <div style={{ fontSize:13, color:'var(--text2)', marginBottom:24 }}>{p.period}</div>
              <ul style={{ listStyle:'none', marginBottom:28, display:'flex', flexDirection:'column', gap:10 }}>
                {p.features.map(f => (
                  <li key={f.text} style={{ fontSize:13, color:f.ok?'var(--text2)':'var(--text3)', display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ color:f.ok?'var(--green)':'var(--text3)', fontWeight:700, flexShrink:0 }}>{f.ok?'✓':'✗'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <button onClick={() => upgrade(p.key)} disabled={isCurrent || loading === p.key}
                style={{
                  width:'100%', border:'none', borderRadius:10, padding:12, fontSize:14,
                  fontWeight: p.popular ? 700 : 400,
                  fontFamily: p.popular ? 'Rajdhani,sans-serif' : 'DM Sans,sans-serif',
                  letterSpacing: p.popular ? '0.5px' : 0,
                  cursor: isCurrent || loading === p.key ? 'not-allowed' : 'pointer',
                  opacity: loading === p.key ? 0.6 : 1,
                  background: isCurrent ? 'var(--card2)' : p.popular ? 'var(--gold)' : 'transparent',
                  color: isCurrent ? 'var(--text3)' : p.popular ? 'var(--dark)' : 'var(--text)',
                  border: p.popular || isCurrent ? 'none' : '1px solid var(--border2)',
                  transition:'all 0.2s'
                }}>
                {loading === p.key ? 'Processing...' : isCurrent ? 'Current Plan' : p.key === 'enterprise' ? 'Contact Sales' : `Upgrade to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:24, marginTop:24 }}>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:16, fontWeight:600, marginBottom:14 }}>ℹ About Plans</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            ['🔄','Instant Upgrade','Plan upgrades are effective immediately. Your check count is updated right away.'],
            ['🔒','Secure Payments','Payment processing powered by industry-standard encryption. (Integrate Razorpay/Stripe in backend)'],
            ['📞','Support','Free plan: community support. Pro: email support. Enterprise: 24/7 dedicated support.'],
          ].map(([ic,t,d]) => (
            <div key={t}>
              <div style={{ fontSize:22, marginBottom:8 }}>{ic}</div>
              <div style={{ fontSize:14, fontWeight:500, marginBottom:6 }}>{t}</div>
              <div style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
