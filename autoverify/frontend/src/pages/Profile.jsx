import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width:44, height:24, background:on?'var(--gold)':'var(--border)', borderRadius:12, cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:18, height:18, background:'#fff', borderRadius:'50%', position:'absolute', top:3, left:on?23:3, transition:'left 0.2s' }} />
    </div>
  );
}

export default function Profile({ toast }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ firstName:user?.firstName||'', lastName:user?.lastName||'', phone:user?.phone||'', city:user?.city||'' });
  const [notif, setNotif] = useState(user?.notifications || { email:true, challan:true, price:false, sms:false });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const initials = user ? `${user.firstName?.[0]||''}${user.lastName?.[0]||''}`.toUpperCase() : 'U';

  const saveProfile = async () => {
    if (!form.firstName || !form.lastName) { toast('Name fields are required.','error'); return; }
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      toast('Profile updated!','success');
    } catch (err) { toast(err.response?.data?.message || 'Update failed.','error'); }
    finally { setSavingProfile(false); }
  };

  const saveNotif = async (key, val) => {
    const updated = { ...notif, [key]: val };
    setNotif(updated);
    try {
      const res = await api.put('/users/notifications', updated);
      updateUser(res.data.user);
      toast('Notification settings saved.','success');
    } catch { toast('Could not save settings.','error'); }
  };

  const changePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast('All password fields are required.','error'); return; }
    if (pwForm.newPassword.length < 6) { toast('New password must be at least 6 characters.','error'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast('Passwords do not match.','error'); return; }
    setSavingPw(true);
    try {
      await api.put('/users/change-password', { currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword });
      toast('Password updated!','success');
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) { toast(err.response?.data?.message || 'Failed to update password.','error'); }
    finally { setSavingPw(false); }
  };

  const Card = ({ children, style={} }) => (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:24, marginBottom:16, ...style }}>{children}</div>
  );
  const STitle = ({ children }) => (
    <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:16, fontWeight:600, marginBottom:18, paddingBottom:14, borderBottom:'1px solid var(--border)' }}>{children}</div>
  );

  return (
    <div style={{ padding:28, animation:'fadeIn 0.4s ease' }}>
      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:20 }}>
        {/* Left — Profile card */}
        <div>
          <Card style={{ textAlign:'center' }}>
            <div style={{ width:80, height:80, background:'var(--gold)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:30, color:'var(--dark)', margin:'0 auto 14px' }}>
              {initials}
            </div>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700 }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize:13, color:'var(--text2)', marginTop:4 }}>{user?.email}</div>
            <div style={{ display:'inline-block', background:'var(--gold-dim)', border:'1px solid rgba(232,184,75,0.3)', color:'var(--gold)', padding:'4px 14px', borderRadius:20, fontSize:12, marginTop:10 }}>
              {user?.plan ? user.plan.charAt(0).toUpperCase()+user.plan.slice(1) : 'Free'} Plan
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:20 }}>
              {[
                ['totalChecks','Total Checks'],
                ['checksRemaining','Checks Left'],
              ].map(([k,l]) => (
                <div key={k} style={{ background:'var(--card2)', borderRadius:10, padding:14, textAlign:'center' }}>
                  <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:24, fontWeight:700, color:'var(--gold)' }}>{user?.[k]||0}</div>
                  <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — Settings */}
        <div>
          <Card>
            <STitle>Personal Information</STitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>First Name</label>
                <input value={form.firstName} onChange={e=>setForm(p=>({...p,firstName:e.target.value}))} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Last Name</label>
                <input value={form.lastName} onChange={e=>setForm(p=>({...p,lastName:e.target.value}))} />
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Phone</label>
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210" />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>City</label>
              <input value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} placeholder="Ludhiana, Punjab" />
            </div>
            <button onClick={saveProfile} disabled={savingProfile}
              style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:10, padding:'11px 28px', fontSize:14, fontWeight:700, fontFamily:'Rajdhani,sans-serif', cursor:savingProfile?'not-allowed':'pointer', opacity:savingProfile?0.6:1 }}>
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </Card>

          <Card>
            <STitle>Notifications</STitle>
            {[
              { key:'email',   label:'Email Alerts',   desc:'Get report summaries by email' },
              { key:'challan', label:'Challan Alerts',  desc:'Notify when new challans appear' },
              { key:'price',   label:'Price Alerts',    desc:'Market price change notifications' },
              { key:'sms',     label:'SMS Alerts',      desc:'Verification alerts via SMS' },
            ].map(n => (
              <div key={n.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize:14 }}>{n.label}</div>
                  <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{n.desc}</div>
                </div>
                <Toggle on={notif[n.key]} onToggle={() => saveNotif(n.key, !notif[n.key])} />
              </div>
            ))}
          </Card>

          <Card>
            <STitle>Change Password</STitle>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Current Password</label>
              <input type="password" value={pwForm.currentPassword} onChange={e=>setPwForm(p=>({...p,currentPassword:e.target.value}))} placeholder="••••••••" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
              <div>
                <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>New Password</label>
                <input type="password" value={pwForm.newPassword} onChange={e=>setPwForm(p=>({...p,newPassword:e.target.value}))} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, color:'var(--text2)', marginBottom:7 }}>Confirm Password</label>
                <input type="password" value={pwForm.confirmPassword} onChange={e=>setPwForm(p=>({...p,confirmPassword:e.target.value}))} placeholder="••••••••" />
              </div>
            </div>
            <button onClick={changePassword} disabled={savingPw}
              style={{ background:'transparent', color:'var(--text)', border:'1px solid var(--border2)', borderRadius:10, padding:'11px 28px', fontSize:14, cursor:savingPw?'not-allowed':'pointer', opacity:savingPw?0.6:1, transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text)';}}>
              {savingPw ? 'Updating...' : 'Update Password'}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
