import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function StationeryPage() {
  const [ordersByUser, setOrdersByUser] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`https://bookmart-website.onrender.com/api/orders/${statusFilter}`);
      const orders = response.data.orders;
      setOrdersByUser(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, fetchOrders]);

  const markAsComplete = async (orderId) => {
    try {
      const response = await axios.put(`https://bookmart-website.onrender.com/api/orders/${orderId}/complete`);
      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error marking order as complete:', error);
    }
  };

  const markAsReadyToPick = async (orderId) => {
    try {
      const response = await axios.put(`https://bookmart-website.onrender.com/api/orders/${orderId}/readytopick`);
      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error marking order as ready to pick:', error);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const renderOrders = (orders) => {
    return orders.map(order => (
      <div key={order._id} className="order">
        <div className='order-details'>
          <h3>Username: {order.username} {'\u00A0\u00A0\u00A0\u00A0'} Date: {new Date(order.order_date).toLocaleString()}</h3>
          
          {expandedOrderId === order._id && expandedOrders[order._id] && (
            <div>
              <ul className='order-items'>
              <div className='order-items-desc'>
                            <div>Name</div>
                            <div>Price</div>
                            <div>Quantity</div>
                            <div>Total</div>
                          </div>
                {order.order_items.map(ord => (
                  <div key={ord._id} className='order-item'>
                    <div>{ord.name}</div>
                    <div>Rs. {ord.price}</div>
                    <div>{ord.quantity}</div>
                    <div>Rs. {ord.price * ord.quantity}</div>

                  </div>
                ))}
              </ul>
              <p><b><i>Total Amount :</i></b> {'\u00A0\u00A0\u00A0'}  Rs. {order.bill_amt}</p>
              {statusFilter === 'readytopick' ? (
                <button className='btn-2' onClick={() => markAsComplete(order._id)}>Mark as Complete</button>
              ) : statusFilter === 'pending' ? (
                <button className='btn-2' onClick={() => markAsReadyToPick(order._id)}>Mark as Ready to pick</button>
              ) : null}
            </div>
          )}
        </div>
        <button className='btn-1' onClick={() => toggleOrderDetails(order._id)}>
          {expandedOrderId === order._id && expandedOrders[order._id] ? 'Less' : 'More...'}
        </button>
      </div>
    ));
  };

  return (
    <section className="product-list">
      <div className='orders'>
        <div><button className={statusFilter === 'pending' ? 'btn-1' : 'btn-2'} onClick={() => setStatusFilter('pending')}>Pending </button></div>
        <div><button className={statusFilter === 'readytopick' ? 'btn-1' : 'btn-2'} onClick={() => setStatusFilter('readytopick')}>Ready to Pick</button></div>
        <div><button className={statusFilter === 'complete' ? 'btn-1' : 'btn-2'} onClick={() => setStatusFilter('complete')}>Previous</button></div>
      </div>
      {renderOrders(ordersByUser.filter(order => order.status === statusFilter))}
    </section>
  );
}

export default StationeryPage;
