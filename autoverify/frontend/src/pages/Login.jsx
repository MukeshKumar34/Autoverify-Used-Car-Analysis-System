import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login({ toast }) {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email || !form.email.includes('@')) e.email = 'Enter a valid email.';
    if (!form.password || form.password.length < 6)   e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast('Welcome back!', 'success');
      navigate('/app/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) => ({
    value: form[field],
    onChange: e => { setForm(p => ({...p,[field]:e.target.value})); setErrors(p=>({...p,[field]:''})); },
    style: { borderColor: errors[field] ? 'var(--red)' : undefined }
  });

  return (
    <AuthLayout title="Welcome back" subtitle="New here?" subtitleLinkText="Create a free account" subtitleLinkTo="/signup">
      <div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Email address</label>
          <input type="email" placeholder="you@example.com" {...inp('email')} />
          {errors.email && <div style={{ color:'var(--red)', fontSize:12, marginTop:5 }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Password</label>
          <input type="password" placeholder="••••••••" {...inp('password')} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
          {errors.password && <div style={{ color:'var(--red)', fontSize:12, marginTop:5 }}>{errors.password}</div>}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text2)', cursor:'pointer' }}>
            <input type="checkbox" style={{ width:'auto', accentColor:'var(--gold)' }} /> Remember me
          </label>
          <span style={{ fontSize:13, color:'var(--gold)', cursor:'pointer' }}>Forgot password?</span>
        </div>
        <button onClick={handleSubmit} disabled={loading}
          style={{ width:'100%', background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:13, fontSize:15, fontWeight:700, fontFamily:'Rajdhani,sans-serif', letterSpacing:'0.5px', cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, transition:'all 0.2s' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0', color:'var(--text3)', fontSize:13 }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }}/> or continue with <div style={{ flex:1, height:1, background:'var(--border)'}}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {['Google','Facebook'].map(p => (
            <button key={p} onClick={() => toast('OAuth integration — connect your provider credentials','info')}
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
