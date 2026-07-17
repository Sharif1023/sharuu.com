import { Minus, Plus, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useStore } from '../../contexts/StoreContext';
import { formatMoney } from '../../lib/utils';
import { api } from '../../services/api';

const initialForm = { name:'',phone:'',email:'',address:'',shippingAreaId:'',paymentMethodId:'',transactionId:'',note:'' };

export default function Checkout() {
  const { items, subtotal, updateQuantity, clearCart } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();
  const [form,setForm] = useState(initialForm);
  const [couponCode,setCouponCode] = useState('');
  const [coupon,setCoupon] = useState(null);
  const [error,setError] = useState('');
  const [saving,setSaving] = useState(false);
  const shippingArea = (settings?.shippingAreas || []).find(item => item.id === form.shippingAreaId);
  const paymentMethod = (settings?.paymentMethods || []).find(item => item.id === form.paymentMethodId);
  const shippingFee = coupon?.freeShipping ? 0 : Number(shippingArea?.charge || 0);
  const discount = Number(coupon?.discount || 0);
  const total = Math.max(0,subtotal - discount + shippingFee);
  const missing = useMemo(() => {
    const labels=[];
    if(!form.name.trim()) labels.push('Name');
    if(!form.address.trim()) labels.push('Address');
    if(!form.phone.trim()) labels.push('Phone number');
    if(!form.shippingAreaId) labels.push('Shipping area');
    if(!form.paymentMethodId) labels.push('Payment method');
    return labels;
  },[form]);

  const applyCoupon = async () => { try { setError(''); const result=await api.validateCoupon({ code:couponCode,subtotal,shippingAreaId:form.shippingAreaId }); setCoupon(result); } catch(requestError) { setCoupon(null); setError(requestError.message); } };
  const submit = async event => {
    event.preventDefault();
    if (!items.length) return setError('Your cart is empty.');
    if (missing.length) return setError(`Required: ${missing.join(', ')}.`);
    if (paymentMethod?.requiresTransactionId && !form.transactionId.trim()) return setError('Transaction ID is required for this payment method.');
    setSaving(true); setError('');
    try {
      const result=await api.createOrder({
        customer:{ name:form.name.trim(),phone:form.phone.trim(),email:form.email.trim(),address:form.address.trim() },
        shippingAreaId:form.shippingAreaId,
        paymentMethodId:form.paymentMethodId,
        transactionId:form.transactionId.trim(),
        note:form.note.trim(),
        couponCode:coupon?.code || couponCode.trim(),
        items:items.map(item => ({ productId:item.productId,variantId:item.variantId,quantity:item.quantity }))
      });
      clearCart();
      navigate(`/order-success/${result.order.id}?token=${encodeURIComponent(result.order.publicToken)}`);
    } catch(requestError) { setError(requestError.message); } finally { setSaving(false); }
  };

  if (!items.length) return <main className="page container"><div className="empty-state"><h1>Your cart is empty</h1><p>Add products before checkout.</p></div></main>;
  return <main className="page container"><div className="page-heading"><span className="eyebrow">Secure checkout</span><h1>Complete your order</h1><p>Quantity and selected Color, Size, Age or other options can be reviewed here.</p></div><form className="checkout-layout" onSubmit={submit}><section className="checkout-form"><div className="form-section"><h2>Order items</h2>{items.map(item => <article className="checkout-item" key={item.id}><img src={item.image} alt={item.name}/><div><h3>{item.name}</h3><div className="cart-options">{Object.entries(item.selectedOptionLabels || {}).map(([label,value]) => <span key={label}><strong>{label}:</strong> {value}</span>)}</div><strong>{formatMoney(item.unitPrice,settings?.currencySymbol)}</strong></div><div className="quantity-control"><button type="button" onClick={() => updateQuantity(item.id,item.quantity-1)}><Minus size={14}/></button><b>{item.quantity}</b><button type="button" onClick={() => updateQuantity(item.id,item.quantity+1)}><Plus size={14}/></button></div></article>)}</div><div className="form-section"><h2>Customer information</h2><div className="form-grid"><label>Full Name <em>*</em><input value={form.name} onChange={event => setForm({...form,name:event.target.value})} required/></label><label>Phone Number <em>*</em><input value={form.phone} onChange={event => setForm({...form,phone:event.target.value})} required/></label><label>Email<input type="email" value={form.email} onChange={event => setForm({...form,email:event.target.value})}/></label><label className="full-field">Full Address <em>*</em><textarea rows="3" value={form.address} onChange={event => setForm({...form,address:event.target.value})} required/></label></div></div><div className="form-section"><h2>Shipping Area <em>*</em></h2><div className="selection-cards">{(settings?.shippingAreas || []).filter(item => item.active).map(area => <label key={area.id} className={form.shippingAreaId===area.id?'selected':''}><input type="radio" name="shippingArea" value={area.id} checked={form.shippingAreaId===area.id} onChange={() => setForm({...form,shippingAreaId:area.id})}/><span><strong>{area.name}</strong><small>{area.estimate}</small></span><b>{formatMoney(area.charge,settings?.currencySymbol)}</b></label>)}</div></div><div className="form-section"><h2>Payment Method <em>*</em></h2><div className="selection-cards">{(settings?.paymentMethods || []).filter(item => item.enabled).map(method => <label key={method.id} className={form.paymentMethodId===method.id?'selected':''}><input type="radio" name="payment" value={method.id} checked={form.paymentMethodId===method.id} onChange={() => setForm({...form,paymentMethodId:method.id})}/><span><strong>{method.name}</strong><small>{method.instructions}</small></span></label>)}</div>{paymentMethod?.accountNumber&&<div className="payment-note">Account: <strong>{paymentMethod.accountNumber}</strong></div>}{paymentMethod?.requiresTransactionId&&<label>Transaction ID <em>*</em><input value={form.transactionId} onChange={event => setForm({...form,transactionId:event.target.value})} required/></label>}</div><div className="form-section"><label>Order Note<textarea rows="3" value={form.note} onChange={event => setForm({...form,note:event.target.value})}/></label></div></section><aside className="summary-card checkout-summary"><h2>Order Summary</h2><div><span>Subtotal</span><strong>{formatMoney(subtotal,settings?.currencySymbol)}</strong></div><div><span>Shipping</span><strong>{form.shippingAreaId?formatMoney(shippingFee,settings?.currencySymbol):'Select area'}</strong></div>{discount>0&&<div className="discount-line"><span>Coupon {coupon?.code}</span><strong>-{formatMoney(discount,settings?.currencySymbol)}</strong></div>}<div className="coupon-box"><input value={couponCode} onChange={event => setCouponCode(event.target.value.toUpperCase())} placeholder="Coupon Code"/><button type="button" onClick={applyCoupon}>Apply</button></div><div className="summary-total"><span>Total</span><strong>{formatMoney(total,settings?.currencySymbol)}</strong></div>{error&&<div className="error-box">{error}</div>}<button className="btn btn-primary full" disabled={saving}>{saving?'Placing order...':'Place Order'}</button><p className="secure-note"><ShieldCheck size={16}/> Required fields must be completed before order placement.</p></aside></form></main>;
}
