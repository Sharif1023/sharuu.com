import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedAdmin from './components/ProtectedAdmin';
import PublicLayout from './components/PublicLayout';
import ScrollToTop from './components/ScrollToTop';
import { useStore } from './contexts/StoreContext';
import AdminLogin from './pages/admin/AdminLogin';
import Categories from './pages/admin/Categories';
import Coupons from './pages/admin/Coupons';
import Dashboard from './pages/admin/Dashboard';
import Invoice from './pages/admin/Invoice';
import Orders from './pages/admin/Orders';
import Pages from './pages/admin/Pages';
import ProductEditor from './pages/admin/ProductEditor';
import Products from './pages/admin/Products';
import Settings from './pages/admin/Settings';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import CmsPageView from './pages/public/CmsPageView';
import Home from './pages/public/Home';
import OrderSuccess from './pages/public/OrderSuccess';
import ProductDetail from './pages/public/ProductDetail';
import Shop from './pages/public/Shop';
import TrackOrder from './pages/public/TrackOrder';

function DynamicAdminAccess() {
  const { slug } = useParams();
  const { settings } = useStore();
  return slug === (settings?.adminLoginSlug || 'store-admin') ? <AdminLogin/> : <Navigate to="/" replace/>;
}

export default function App() {
  return <><ScrollToTop/><Routes>
    <Route element={<PublicLayout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/shop" element={<Shop/>}/>
      <Route path="/product/:slug" element={<ProductDetail/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/track-order" element={<TrackOrder/>}/>
      <Route path="/order-success/:id" element={<OrderSuccess/>}/>
      <Route path="/page/:slug" element={<CmsPageView/>}/>
    </Route>
    <Route path="/admin/login" element={<AdminLogin/>}/>
    <Route path="/admin-access/:slug" element={<DynamicAdminAccess/>}/>
    <Route path="/admin" element={<ProtectedAdmin><AdminLayout/></ProtectedAdmin>}>
      <Route index element={<Dashboard/>}/>
      <Route path="products" element={<Products/>}/>
      <Route path="products/new" element={<ProductEditor/>}/>
      <Route path="products/:id" element={<ProductEditor/>}/>
      <Route path="categories" element={<Categories/>}/>
      <Route path="coupons" element={<Coupons/>}/>
      <Route path="orders" element={<Orders/>}/>
      <Route path="orders/:id/invoice" element={<Invoice/>}/>
      <Route path="pages" element={<Pages/>}/>
      <Route path="settings" element={<Settings/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></>;
}
