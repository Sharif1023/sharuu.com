import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../contexts/StoreContext';

export default function Shop() {
  const { publicProducts, categories } = useStore();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'featured';
  const selected = categories.find(item => item.id === category);
  const ids = selected?.parentId ? [selected.id] : [category, ...categories.filter(item => item.parentId === category).map(item => item.id)];
  const filtered = useMemo(() => {
    let result = publicProducts.filter(product => {
      const haystack = `${product.name} ${product.productCode} ${product.brand} ${product.description}`.toLowerCase();
      return haystack.includes(search.toLowerCase()) && (!category || ids.includes(product.categoryId) || ids.includes(product.subcategoryId));
    });
    if (sort === 'price-low') result = [...result].sort((a,b) => a.price - b.price);
    if (sort === 'price-high') result = [...result].sort((a,b) => b.price - a.price);
    if (sort === 'newest') result = [...result].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [publicProducts, search, category, sort, ids.join('|')]);
  const update = (key,value) => { const next = new URLSearchParams(params); value ? next.set(key,value) : next.delete(key); setParams(next); };
  return <main className="page container"><div className="page-heading"><span className="eyebrow">Explore the store</span><h1>{selected?.name || 'All Products'}</h1><p>{selected?.description || 'Discover products across every category.'}</p></div><div className="shop-toolbar"><label className="search-field"><Search size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search product, SKU or brand..."/></label><select value={category} onChange={event => update('category',event.target.value)}><option value="">All categories</option>{categories.filter(item => item.active).map(item => <option key={item.id} value={item.id}>{item.parentId ? '— ' : ''}{item.name}</option>)}</select><select value={sort} onChange={event => update('sort',event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option></select><span className="result-count"><SlidersHorizontal size={16}/>{filtered.length} items</span></div>{filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product}/>)}</div> : <div className="empty-state"><h2>No products found</h2><p>Try another search or category.</p></div>}</main>;
}
