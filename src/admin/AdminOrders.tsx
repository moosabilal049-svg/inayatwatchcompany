import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../api/client';
import { Order, OrderStatus } from '../types';
import {
  ShoppingBag,
  MessageCircle,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const STATUS_LIST: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOrders: React.FC = () => {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleWhatsAppContact = (order: Order) => {
    const cleanPhone = order.whatsapp.replace(/[^0-9]/g, '');
    const phoneWithCode = cleanPhone.startsWith('92')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? '92' + cleanPhone.substring(1)
      : '92' + cleanPhone;

    const text = `*Assalamualaikum ${order.customer_name},*\nThis is Inayat Watch Company regarding your order *${order.order_number}* (Total: Rs. ${order.total.toLocaleString()}).\n\nYour order is currently: *${order.status}*.\nPlease confirm if your delivery address in ${order.city} is correct.`;

    window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
            NATIONWIDE FULFILLMENT
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
            Orders ({orders.length})
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 border border-stone-700 hover:border-white text-stone-300 hover:text-white text-xs uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-[#121212] border border-[#242424] p-4 flex flex-col sm:flex-row gap-4 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, phone, or city..."
            className="w-full bg-[#181818] border border-[#2b2b2b] text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#181818] border border-[#2b2b2b] text-stone-200 px-3 py-2.5 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
        >
          <option value="all">All Statuses ({orders.length})</option>
          {STATUS_LIST.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] border border-[#242424] overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-stone-400 text-xs">
            Loading order records from database...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto stroke-1" />
            <h3 className="font-serif text-lg text-white uppercase">No Orders Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {orders.length === 0
                ? 'No customer orders have been placed yet. When users complete checkout with Cash on Delivery, orders will appear here in real time.'
                : 'No orders match your filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] border-b border-[#242424] text-stone-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order # / Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">City / Address</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#161616] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white font-mono text-sm">
                        {order.order_number}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white text-sm">
                        {order.customer_name}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-500" />
                        <span>{order.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{order.city}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-xs">
                        {order.address}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-stone-300">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} watch(es)
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-xs">
                        {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">
                        Rs. {order.total.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-400 uppercase font-semibold">
                        {order.payment_method}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider bg-black border ${
                          order.status === 'Delivered'
                            ? 'border-emerald-800 text-emerald-300'
                            : order.status === 'Cancelled'
                            ? 'border-rose-800 text-rose-300'
                            : order.status === 'Shipped'
                            ? 'border-blue-800 text-blue-300'
                            : 'border-amber-800 text-amber-300'
                        }`}
                      >
                        {STATUS_LIST.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1-Click WhatsApp contact */}
                        <button
                          onClick={() => handleWhatsAppContact(order)}
                          className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                          title="Contact customer via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1.5 border border-stone-700 hover:border-white text-stone-300 hover:text-white text-[11px] uppercase tracking-wider transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2b2b2b] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold">
                  ORDER SPECIFICATION
                </div>
                <h3 className="font-serif text-2xl text-white uppercase tracking-wider">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#1a1a1a] border border-[#292929] space-y-2">
                <div className="text-stone-400 uppercase font-semibold text-[10px] tracking-wider">Customer Details</div>
                <div className="text-sm font-semibold text-white">{selectedOrder.customer_name}</div>
                <div className="text-stone-300">Phone: {selectedOrder.phone}</div>
                <div className="text-stone-300">WhatsApp: {selectedOrder.whatsapp}</div>
                {selectedOrder.email && <div className="text-stone-300">Email: {selectedOrder.email}</div>}
              </div>

              <div className="p-4 bg-[#1a1a1a] border border-[#292929] space-y-2">
                <div className="text-stone-400 uppercase font-semibold text-[10px] tracking-wider">Delivery Destination</div>
                <div className="text-sm font-semibold text-[#c5a880]">{selectedOrder.city}</div>
                <div className="text-stone-300 leading-relaxed">{selectedOrder.address}</div>
                {selectedOrder.order_notes && (
                  <div className="text-[11px] text-amber-300/90 pt-1">
                    Notes: {selectedOrder.order_notes}
                  </div>
                )}
              </div>
            </div>

            {/* Items list */}
            <div className="border border-[#292929] bg-[#1a1a1a] p-4 space-y-3 text-xs">
              <div className="text-stone-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#262626] pb-2">
                Ordered Watches ({selectedOrder.items.length})
              </div>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#222222] last:border-none">
                  <div>
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-[10px] text-[#c5a880] uppercase tracking-wider">{item.brand_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-stone-300">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</div>
                    <div className="font-semibold text-white">Rs. {(item.quantity * item.price).toLocaleString()}</div>
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t border-[#292929] space-y-1.5">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Delivery Charges</span>
                  <span>{selectedOrder.delivery_charges === 0 ? 'FREE' : `Rs. ${selectedOrder.delivery_charges}`}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-[#333333]">
                  <span>Total Payable</span>
                  <span className="text-[#c5a880]">Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#242424]">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="bg-black border border-stone-700 text-white px-3 py-1.5 text-xs focus:outline-none"
                >
                  {STATUS_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleWhatsAppContact(selectedOrder)}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Customer</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-stone-700 text-stone-300 hover:text-white text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
