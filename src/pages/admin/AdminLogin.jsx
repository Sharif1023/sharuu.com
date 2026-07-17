import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useStore } from '../../contexts/StoreContext';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const { settings } = useStore();
  const navigate=useNavigate(); const location=useLocation();
  const [email,setEmail]=useState('admin@demo.com'); const[password,setPassword]=useState('admin123'); const[error,setError]=useState(''); const[saving,setSaving]=useState(false);
  const submit=async event=>{event.preventDefault();setSaving(true);setError('');try{await login(email,password);navigate(location.state?.from||'/admin',{replace:true});}catch(requestError){setError(requestError.message);}finally{setSaving(false);}};
  return <main className="login-page"><section className="login-card"><span className="login-icon"><LockKeyhole/></span><span className="eyebrow">Secure workspace</span><h1>{settings?.storeName || 'Sharuu'} Admin</h1><p>Manage products, orders, homepage and footer from one place.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={event=>setEmail(event.target.value)} required/></label><label>Password<input type="password" value={password} onChange={event=>setPassword(event.target.value)} required/></label>{error&&<div className="error-box">{error}</div>}<button className="btn btn-primary full" disabled={saving}>{saving?'Signing in...':'Sign In'}</button></form></section></main>;
}
