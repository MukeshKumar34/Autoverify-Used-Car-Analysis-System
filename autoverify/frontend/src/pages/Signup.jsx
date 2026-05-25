import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

function strengthInfo(pwd) {
  if (!pwd) return { width:'0%', color:'var(--border)', label:'' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { width:'15%', color:'var(--red)',   label:'Too short' },
    { width:'30%', color:'var(--red)',   label:'Weak' },
    { width:'55%', color:'var(--gold)',  label:'Fair' },
    { width:'78%', color:'var(--gold)',  label:'Good' },
    { width:'100%',color:'var(--green)', label:'Strong' },
  ];
  return map[score];
}

export default function Signup({ toast }) {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ firstName:'', lastName:'', email:'', phone:'', password:'' });
  const [errors, setErrors] = useState({});
  const [terms, setTerms]   = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email || !form.email.includes('@')) e.email = 'Enter a valid email.';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters.';
    if (!terms) e.terms = 'You must accept the terms.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await register(form);
      toast('Account created! 3 free checks added.', 'success');
      navigate('/app/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(p=>({...p,[key]:e.target.value})); setErrors(p=>({...p,[key]:''})); },
    style: { borderColor: errors[key] ? 'var(--red)' : undefined }
  });

  const si = strengthInfo(form.password);

  return (
    <AuthLayout title="Create your account" subtitle="Already have one?" subtitleLinkText="Sign in" subtitleLinkTo="/login">
      <div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
          <div>
            <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>First Name</label>
            <input type="text" placeholder="Rahul" {...field('firstName')} />
            {errors.firstName && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.firstName}</div>}
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Last Name</label>
            <input type="text" placeholder="Kumar" {...field('lastName')} />
            {errors.lastName && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.lastName}</div>}
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Email address</label>
          <input type="email" placeholder="rahul@example.com" {...field('email')} />
          {errors.email && <div style={{ color:'var(--red)', fontSize:12, marginTop:5 }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Phone Number</label>
          <input type="tel" placeholder="+91 98765 43210" {...field('phone')} />
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Password</label>
          <input type="password" placeholder="Create a strong password" {...field('password')} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
          <div style={{ height:3, background:'var(--border)', borderRadius:2, marginTop:7, overflow:'hidden' }}>
            <div style={{ height:'100%', width:si.width, background:si.color, borderRadius:2, transition:'all 0.3s' }} />
          </div>
          {si.label && <div style={{ fontSize:11, color:si.color, marginTop:4 }}>{si.label}</div>}
          {errors.password && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.password}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:24 }}>
          <input type="checkbox" checked={terms} onChange={e=>{ setTerms(e.target.checked); setErrors(p=>({...p,terms:''})); }}
            style={{ width:'auto', marginTop:2, accentColor:'var(--gold)' }} />
          <label style={{ fontSize:13, color:'var(--text2)', lineHeight:1.5 }}>
            I agree to the <span style={{ color:'var(--gold)' }}>Terms of Service</span> and <span style={{ color:'var(--gold)' }}>Privacy Policy</span>
          </label>
        </div>
        {errors.terms && <div style={{ color:'var(--red)', fontSize:12, marginBottom:12 }}>{errors.terms}</div>}
        <button onClick={handleSubmit} disabled={loading}
          style={{ width:'100%', background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:13, fontSize:15, fontWeight:700, fontFamily:'Rajdhani,sans-serif', letterSpacing:'0.5px', cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, transition:'all 0.2s' }}>
          {loading ? 'Creating Account...' : 'Create Free Account'}
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0', color:'var(--text3)', fontSize:13 }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }}/> or <div style={{ flex:1, height:1, background:'var(--border)'}}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {['Google','Facebook'].map(p => (
            <button key={p} onClick={() => toast('OAuth — connect your provider credentials','info')}
              style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:11, fontSize:13, color:'var(--text2)', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)';}}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
