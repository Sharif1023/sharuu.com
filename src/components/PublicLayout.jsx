import { Facebook, Home, Instagram, Menu, PackageSearch, Search, ShoppingBag, Store, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';

function WhatsAppIcon({ size = 20 }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>◉</span>;
}

export default function PublicLayout() {
  const { settings, categories, pages } = useStore();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const topCategories = categories.filter(item => !item.parentId && item.active && item.showInMenu).sort((a,b) => a.sortOrder - b.sortOrder);
  const socials = settings?.socialLinks || {};
  const submitSearch = event => { event.preventDefault(); if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`); };

  return <div className="site-shell">
    {settings?.announcement && <div className="announcement">{settings.announcement}</div>}
    <header className="site-header">
      <div className="container header-main">
        <button className="mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu/></button>
        <Link to="/" className="brand-link" aria-label="Go to home">
          {settings?.logo ? <img src={settings.logo} alt={settings.storeName}/> : <span className="brand-mark">S</span>}
          <span><strong>{settings?.storeName || 'Sharuu Universal Store'}</strong><small>{settings?.slogan}</small></span>
        </Link>
        <form className="header-search" onSubmit={submitSearch}><Search size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products..."/></form>
        <div className="header-actions"><Link to="/track-order"><PackageSearch/><span>Track</span></Link><Link className="cart-link" to="/cart"><ShoppingBag/><span>Cart</span>{count > 0 && <b>{count}</b>}</Link></div>
      </div>
      <nav className="category-nav"><div className="container category-nav-inner"><NavLink to="/shop">All Products</NavLink>{topCategories.map(category => <NavLink key={category.id} to={`/shop?category=${category.id}`}>{category.name}</NavLink>)}</div></nav>
    </header>

    <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
      <button className="drawer-overlay" onClick={() => setMenuOpen(false)} aria-label="Close menu"/>
      <aside>
        <div className="drawer-heading"><Link to="/" onClick={() => setMenuOpen(false)}><strong>{settings?.storeName}</strong></Link><button onClick={() => setMenuOpen(false)}><X/></button></div>
        <form className="drawer-search" onSubmit={event => { submitSearch(event); setMenuOpen(false); }}><Search size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search..."/></form>
        <div className="drawer-links"><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link><Link to="/shop" onClick={() => setMenuOpen(false)}>All Products</Link>{topCategories.map(category => <div key={category.id} className="drawer-category"><Link to={`/shop?category=${category.id}`} onClick={() => setMenuOpen(false)}>{category.name}</Link>{categories.filter(item => item.parentId === category.id && item.active).map(child => <Link key={child.id} className="drawer-subcategory" to={`/shop?category=${child.id}`} onClick={() => setMenuOpen(false)}>{child.name}</Link>)}</div>)}</div>
        <div className="drawer-social"><p>Follow us</p><div>{socials.facebook && <a href={socials.facebook} target="_blank" rel="noreferrer"><Facebook/></a>}{socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer"><Instagram/></a>}{socials.whatsapp && <a href={`https://wa.me/${socials.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"><WhatsAppIcon/></a>}</div></div>
      </aside>
    </div>

    <Outlet/>

    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand"><Link to="/" className="brand-link footer-brand-link"><span className="brand-mark">S</span><span><strong>{settings?.storeName}</strong><small>{settings?.slogan}</small></span></Link><p>{settings?.footerDescription || settings?.description}</p><div className="social-links">{socials.facebook && <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook/></a>}{socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a>}{socials.whatsapp && <a href={`https://wa.me/${socials.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon/></a>}</div></div>
        <div><h4>{settings?.footerColumns?.[0]?.title || 'Shop'}</h4><Link to="/shop">All Products</Link>{topCategories.slice(0,5).map(item => <Link key={item.id} to={`/shop?category=${item.id}`}>{item.name}</Link>)}</div>
        <div><h4>{settings?.footerColumns?.[1]?.title || 'Information'}</h4>{pages.filter(page => page.status === 'published').slice(0,6).map(page => <Link key={page.id} to={`/page/${page.slug}`}>{page.title}</Link>)}</div>
        <div><h4>{settings?.footerContactTitle || 'Contact'}</h4><p>{settings?.supportPhone}</p><p>{settings?.supportEmail}</p><p>{settings?.address}</p></div>
      </div>
      <div className="container footer-bottom"><span>{settings?.footerText}</span><span>{settings?.footerBottomText || 'Secure shopping · Fast delivery · Easy support'}</span></div>
    </footer>

    <nav className="mobile-bottom-nav"><NavLink to="/"><Home/><span>Home</span></NavLink><NavLink to="/shop"><Store/><span>Shop</span></NavLink><button onClick={() => setMenuOpen(true)}><Menu/><span>Menu</span></button><NavLink to="/track-order"><PackageSearch/><span>Track</span></NavLink><NavLink className="mobile-cart" to="/cart"><ShoppingBag/><span>Cart</span>{count > 0 && <b>{count}</b>}</NavLink></nav>
  </div>;
}
