import { Boxes, CircleGauge, FileText, FolderTree, LogOut, Menu, Package, Settings, ShoppingCart, Tags, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useStore } from '../contexts/StoreContext';

const nav = [
  ['Dashboard','/admin',CircleGauge],['Products','/admin/products',Boxes],['Categories','/admin/categories',FolderTree],['Coupons','/admin/coupons',Tags],['Orders','/admin/orders',ShoppingCart],['CMS Pages','/admin/pages',FileText],['Settings','/admin/settings',Settings]
];

export default function AdminLayout() {
  const [open,setOpen] = useState(false);
  const { admin,logout } = useAdminAuth();
  const { settings } = useStore();
  const navigate = useNavigate();
  const exit = async () => { await logout(); navigate('/admin/login'); };
  return <div className="admin-shell"><button className="admin-mobile-toggle" onClick={() => setOpen(true)}><Menu/></button><aside className={`admin-sidebar ${open?'open':''}`}><div className="admin-brand"><span className="brand-mark">S</span><div><strong>{settings?.storeName || 'Sharuu'}</strong><small>Admin Workspace</small></div><button onClick={() => setOpen(false)}><X/></button></div><nav>{nav.map(([label,path,Icon]) => <NavLink key={path} to={path} end={path==='/admin'} onClick={() => setOpen(false)}><Icon/><span>{label}</span></NavLink>)}</nav><div className="admin-user"><span><strong>{admin?.name}</strong><small>{admin?.email}</small></span><button onClick={exit}><LogOut/></button></div></aside><main className="admin-main"><Outlet/></main>{open&&<button className="admin-overlay" onClick={() => setOpen(false)}/>}</div>;
}
