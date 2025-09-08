'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, MapPin, MessageCircle, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Order, Message, OrderStatus } from '@/types';
import { formatCurrency, formatTime, getOrderStatusColor, getOrderStatusText } from '@/lib/utils';

const statusSteps: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'received', label: 'Order Received', icon: CheckCircle },
  { status: 'preparing', label: 'Preparing', icon: Clock },
  { status: 'picked_up', label: 'Runner Picked Up', icon: MapPin },
  { status: 'en_route', label: 'En Route', icon: MapPin },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [etaSeconds, setEtaSeconds] = useState(0);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      fetchMessages();
      
      // Set up polling for order updates
      const interval = setInterval(() => {
        fetchOrder();
        fetchMessages();
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(interval);
    }
  }, [orderId]);

  useEffect(() => {
    if (order) {
      // Calculate ETA countdown
      const now = Date.now();
      const orderTime = order.createdAt;
      const etaMs = order.etaMinutes * 60 * 1000;
      const remainingMs = Math.max(0, (orderTime + etaMs) - now);
      setEtaSeconds(Math.floor(remainingMs / 1000));

      // Update countdown every second
      const countdownInterval = setInterval(() => {
        setEtaSeconds(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/messages`);
      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessage,
          sender: 'customer'
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex(step => step.status === order.status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-4">Order Not Found</h1>
          <p className="text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-100">Order #{order.id}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-xl font-semibold text-primary mb-6">Order Status</h2>
              
              {/* Status Steps */}
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.status} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        isCompleted 
                          ? 'bg-accent text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isCurrent ? 'text-accent' : isCompleted ? 'text-primary' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </div>
                        {isCurrent && order.status !== 'delivered' && (
                          <div className="text-sm text-gray-500">
                            {order.status === 'preparing' && 'Your order is being prepared'}
                            {order.status === 'picked_up' && 'Runner has picked up your order'}
                            {order.status === 'en_route' && 'Runner is on the way to your seat'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ETA Countdown */}
            {order.status !== 'delivered' && (
              <div className="card mb-8">
                <h2 className="text-xl font-semibold text-primary mb-4">Estimated Delivery Time</h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">
                    {formatTime(etaSeconds)}
                  </div>
                  <p className="text-gray-600">
                    {order.status === 'received' && 'Your order will be ready soon'}
                    {order.status === 'preparing' && 'Food is being prepared'}
                    {order.status === 'picked_up' && 'Runner is on the way'}
                    {order.status === 'en_route' && 'Almost there!'}
                  </p>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-primary mb-6">Order Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat Location</span>
                  <span className="font-medium">
                    Section {order.seat.section}, Row {order.seat.row}, Seat {order.seat.seat}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Method</span>
                  <span className="font-medium capitalize">
                    {order.deliveryPrefs.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Updates</span>
                  <span className="font-medium">
                    {order.contact.method === 'email' ? (
                      <>
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 inline mr-1" />
                        SMS
                      </>
                    )}
                  </span>
                </div>
                {order.deliveryPrefs.notes && (
                  <div>
                    <span className="text-gray-600">Special Instructions</span>
                    <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg">
                      {order.deliveryPrefs.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-primary mb-4">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7%)</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>{formatCurrency(order.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span>{formatCurrency(order.tip.amount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat & Help */}
          <div className="lg:col-span-1">
            {/* Chat */}
            <div className="card mb-6">
              <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with Runner
              </h2>
              
              <div className="h-64 overflow-y-auto custom-scrollbar mb-4 space-y-3">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'customer' 
                        ? 'bg-accent text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'customer' ? 'text-accent-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.ts).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input flex-1 text-sm"
                />
                <button
                  type="submit"
                  className="btn-accent px-4 py-2 text-sm"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Help */}
            <div className="card">
              <h2 className="text-lg font-semibold text-primary mb-4">Need Help?</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-primary">Report a Problem</div>
                  <div className="text-sm text-gray-600">Issue with your order?</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-primary">Contact Support</div>
                  <div className="text-sm text-gray-600">Get help from our team</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-primary">Cancel Order</div>
                  <div className="text-sm text-gray-600">Cancel within 2 minutes</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
