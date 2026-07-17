import { CheckCircle2, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useStore } from '../../contexts/StoreContext';
import { formatMoney } from '../../lib/utils';

export default function OrderSuccess() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { settings } = useStore();
  const [order,setOrder] = useState(null);
  const [error,setError] = useState('');
  useEffect(() => { api.getOrder(id,params.get('token') || '').then(setOrder).catch(error => setError(error.message)); },[id,params]);
  if (error) return <main className="page container"><div className="error-box">{error}</div></main>;
  if (!order) return <div className="screen-loader">Loading order...</div>;
  return <main className="page container narrow-page"><div className="order-success"><CheckCircle2 size={58}/><span className="eyebrow">Order confirmed</span><h1>Thank you, {order.customer?.name}!</h1><p>Your order number is <strong>{order.orderNumber}</strong>. Save it for tracking.</p><div className="success-summary"><div><span>Total</span><strong>{formatMoney(order.total,settings?.currencySymbol)}</strong></div><div><span>Payment</span><strong>{order.paymentMethodName}</strong></div><div><span>Shipping Area</span><strong>{order.shippingAreaName}</strong></div></div><div className="button-row centered"><Link className="btn btn-primary" to="/track-order">Track Order</Link><button className="btn btn-light" onClick={() => window.print()}><Printer size={16}/>Print</button></div></div></main>;
}
