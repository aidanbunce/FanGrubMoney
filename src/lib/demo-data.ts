import { mockDb } from './mock-db';
import { Order } from '@/types';

// Demo data seeder for testing
export function seedDemoData() {
  // Create some sample orders for testing
  const demoOrders: Omit<Order, 'id' | 'createdAt' | 'status'>[] = [
    {
      customerId: 'demo_customer_1',
      items: [
        { id: '1', name: 'Stadium Burger', price: 12.99, quantity: 1, category: 'Burgers' },
        { id: '7', name: 'Beer', price: 8.99, quantity: 2, category: 'Beverages' }
      ],
      seat: { section: '105', row: 'A', seat: '12' },
      contact: { method: 'email', value: 'demo@example.com' },
      deliveryPrefs: { type: 'leave_at_seat', notes: 'Please leave at seat' },
      tip: { amount: 3.50, percentage: 15 },
      subtotal: 30.97,
      tax: 2.17,
      serviceFee: 1.99,
      total: 38.63,
      etaMinutes: 12,
      paymentMethod: { type: 'card', last4: '1234' }
    },
    {
      customerId: 'demo_customer_2',
      items: [
        { id: '2', name: 'Chicken Tenders', price: 10.99, quantity: 1, category: 'Chicken' },
        { id: '8', name: 'Soda', price: 4.99, quantity: 1, category: 'Beverages' }
      ],
      seat: { section: '112', row: 'B', seat: '8' },
      contact: { method: 'sms', value: '+1234567890' },
      deliveryPrefs: { type: 'handoff', notes: 'I will meet you at the aisle' },
      tip: { amount: 2.00, percentage: 10 },
      subtotal: 15.98,
      tax: 1.12,
      serviceFee: 1.99,
      total: 21.09,
      etaMinutes: 8,
      paymentMethod: { type: 'card', last4: '5678' }
    },
    {
      customerId: 'demo_customer_3',
      items: [
        { id: '3', name: 'Loaded Nachos', price: 8.99, quantity: 1, category: 'Snacks' },
        { id: '4', name: 'Hot Dog', price: 6.99, quantity: 2, category: 'Hot Dogs' }
      ],
      seat: { section: '108', row: 'C', seat: '15' },
      contact: { method: 'email', value: 'test@example.com' },
      deliveryPrefs: { type: 'leave_at_seat' },
      tip: { amount: 4.00, percentage: 20 },
      subtotal: 22.97,
      tax: 1.61,
      serviceFee: 1.99,
      total: 30.57,
      etaMinutes: 15,
      paymentMethod: { type: 'card', last4: '9012' }
    }
  ];

  // Add demo orders to the database
  demoOrders.forEach(orderData => {
    const order = mockDb.createOrder(orderData);
    
    // Add some status progression for demo
    if (Math.random() > 0.5) {
      mockDb.updateOrder(order.id, { status: 'preparing' });
    }
    
    // Add some demo messages
    mockDb.addMessage({
      orderId: order.id,
      sender: 'customer',
      text: 'Order placed successfully!'
    });
    
    if (order.status === 'preparing') {
      mockDb.addMessage({
        orderId: order.id,
        sender: 'runner',
        text: 'Your order is being prepared. I\'ll pick it up shortly!'
      });
    }
  });

  console.log('🎉 Demo data seeded successfully!');
  console.log(`📊 Created ${demoOrders.length} demo orders`);
  console.log('🏃‍♂️ Demo runner: runner1 (Alex Johnson)');
  console.log('💡 Use "Try Demo Mode" on the runner login page');
}

// Auto-seed demo data in development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // Only run on server side in development
  setTimeout(() => {
    seedDemoData();
  }, 1000);
}
