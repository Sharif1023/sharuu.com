import { ArrowRight, BadgeCheck, Headphones, RefreshCcw, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../contexts/StoreContext';

export default function Home() {
  const { settings, categories, publicProducts, loading } = useStore();
  const roots = categories.filter(item => !item.parentId && item.active).sort((a,b) => a.sortOrder - b.sortOrder);
  const featured = publicProducts.filter(item => item.featured).slice(0,8);
  const modelImages = (settings?.newArrivalModels || []).filter(item => item.active !== false);
  if (loading && !settings) return <div className="screen-loader">Loading store...</div>;
  return <main>
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.88), rgba(2,6,23,.2)), url(${settings?.heroImage})` }}>
      <div className="container hero-content"><span className="eyebrow light">Universal Commerce</span><h1>{settings?.heroTitle}</h1><p>{settings?.heroSubtitle}</p><Link className="btn btn-accent" to="/shop">{settings?.heroButtonText || 'Shop Now'} <ArrowRight size={18}/></Link></div>
    </section>
    <section className="benefits container"><div><Truck/><span><strong>Fast Delivery</strong><small>Editable shipping zones</small></span></div><div><BadgeCheck/><span><strong>Quality Products</strong><small>Carefully selected items</small></span></div><div><RefreshCcw/><span><strong>Easy Returns</strong><small>Product-specific policies</small></span></div><div><Headphones/><span><strong>Support</strong><small>{settings?.supportPhone}</small></span></div></section>

    <section className="section container"><div className="section-heading"><div><span className="eyebrow">Explore departments</span><h2>Shop by Category</h2></div><Link to="/shop">View all <ArrowRight size={16}/></Link></div><div className="category-grid">{roots.map(category => <Link key={category.id} className="category-card" to={`/shop?category=${category.id}`}><img src={category.image} alt={category.name}/><div><h3>{category.name}</h3><p>{category.description}</p></div></Link>)}</div></section>

    <section className="section section-soft"><div className="container"><div className="section-heading"><div><span className="eyebrow">Selected for you</span><h2>Featured Products</h2></div><Link to="/shop">Shop all <ArrowRight size={16}/></Link></div><div className="product-grid">{featured.map(product => <ProductCard key={product.id} product={product}/>)}</div></div></section>

    <section className="section container branding-grid">{(settings?.brandingBanners || []).filter(item => item.active !== false).map(banner => <Link key={banner.id} to={banner.link || '/shop'} className="branding-banner" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.78), rgba(2,6,23,.15)), url(${banner.image})` }}><div><span className="eyebrow light">Exclusive edit</span><h2>{banner.title}</h2><p>{banner.subtitle}</p><span className="btn btn-light btn-small">{banner.buttonText || 'Explore'} <ArrowRight size={16}/></span></div></Link>)}</section>

    <section className="section container"><div className="section-heading"><div><span className="eyebrow">Campaign gallery</span><h2>New Arrivals</h2><p>Fresh model looks selected for this season.</p></div></div><div className="model-gallery">{modelImages.map((item,index) => <article key={item.id || index} className="model-card"><img src={item.image} alt={item.alt || item.title || `New arrival model ${index + 1}`}/><div><span>{item.kicker || 'New season'}</span><h3>{item.title || 'Fresh Arrival'}</h3>{item.subtitle && <p>{item.subtitle}</p>}</div></article>)}</div></section>
  </main>;
}
