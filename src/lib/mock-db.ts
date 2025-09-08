import { Order, Runner, Message, Batch, MenuItem, ContactForm } from '@/types';
import './demo-data'; // Auto-seed demo data in development

// Mock database - in-memory storage
class MockDatabase {
  private orders: Map<string, Order> = new Map();
  private runners: Map<string, Runner> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private batches: Map<string, Batch> = new Map();
  private menuItems: MenuItem[] = [];
  private contactSubmissions: ContactForm[] = [];
  private nextOrderId = 1;
  private nextMessageId = 1;
  private nextBatchId = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize menu items
    this.menuItems = [
      {
        id: '1',
        name: 'Stadium Burger',
        description: 'Juicy beef patty with lettuce, tomato, and special sauce',
        price: 12.99,
        category: 'Burgers',
        available: true,
      },
      {
        id: '2',
        name: 'Chicken Tenders',
        description: 'Crispy chicken tenders with your choice of dipping sauce',
        price: 10.99,
        category: 'Chicken',
        available: true,
      },
      {
        id: '3',
        name: 'Loaded Nachos',
        description: 'Tortilla chips topped with cheese, jalapeños, and sour cream',
        price: 8.99,
        category: 'Snacks',
        available: true,
      },
      {
        id: '4',
        name: 'Hot Dog',
        description: 'Classic stadium hot dog with mustard and relish',
        price: 6.99,
        category: 'Hot Dogs',
        available: true,
      },
      {
        id: '5',
        name: 'Pizza Slice',
        description: 'Fresh pepperoni pizza slice',
        price: 7.99,
        category: 'Pizza',
        available: true,
      },
      {
        id: '6',
        name: 'Soft Pretzel',
        description: 'Warm soft pretzel with cheese sauce',
        price: 5.99,
        category: 'Snacks',
        available: true,
      },
      {
        id: '7',
        name: 'Beer',
        description: 'Domestic beer (21+ only)',
        price: 8.99,
        category: 'Beverages',
        available: true,
      },
      {
        id: '8',
        name: 'Soda',
        description: 'Fountain drink - Coke, Pepsi, Sprite',
        price: 4.99,
        category: 'Beverages',
        available: true,
      },
    ];

    // Initialize some mock runners
    this.runners.set('runner1', {
      id: 'runner1',
      name: 'Alex Johnson',
      isOnline: true,
      currentSection: '105',
      activeOrderIds: [],
      earningsToday: 45.50,
      completedDeliveries: 12,
      onTimeRate: 0.95,
      avgDeliveryTime: 8.5,
    });

    this.runners.set('runner2', {
      id: 'runner2',
      name: 'Sarah Chen',
      isOnline: false,
      currentSection: '112',
      activeOrderIds: [],
      earningsToday: 32.75,
      completedDeliveries: 8,
      onTimeRate: 0.88,
      avgDeliveryTime: 9.2,
    });
  }

  // Order methods
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const newOrder: Order = {
      ...order,
      id: `order_${this.nextOrderId++}`,
      createdAt: Date.now(),
      status: 'received',
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, ...updates };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  getOrdersByStatus(status: Order['status']): Order[] {
    return Array.from(this.orders.values()).filter(order => order.status === status);
  }

  getOrdersByRunner(runnerId: string): Order[] {
    return Array.from(this.orders.values()).filter(order => order.runnerId === runnerId);
  }

  // Runner methods
  getRunner(id: string): Runner | undefined {
    return this.runners.get(id);
  }

  updateRunner(id: string, updates: Partial<Runner>): Runner | undefined {
    const runner = this.runners.get(id);
    if (runner) {
      const updatedRunner = { ...runner, ...updates };
      this.runners.set(id, updatedRunner);
      return updatedRunner;
    }
    return undefined;
  }

  getOnlineRunners(): Runner[] {
    return Array.from(this.runners.values()).filter(runner => runner.isOnline);
  }

  // Message methods
  addMessage(message: Omit<Message, 'id' | 'ts'>): Message {
    const newMessage: Message = {
      ...message,
      id: `msg_${this.nextMessageId++}`,
      ts: Date.now(),
    };
    
    const orderMessages = this.messages.get(message.orderId) || [];
    orderMessages.push(newMessage);
    this.messages.set(message.orderId, orderMessages);
    
    return newMessage;
  }

  getMessages(orderId: string): Message[] {
    return this.messages.get(orderId) || [];
  }

  // Batch methods
  createBatch(batch: Omit<Batch, 'id' | 'createdAt'>): Batch {
    const newBatch: Batch = {
      ...batch,
      id: `batch_${this.nextBatchId++}`,
      createdAt: Date.now(),
    };
    this.batches.set(newBatch.id, newBatch);
    return newBatch;
  }

  getBatch(id: string): Batch | undefined {
    return this.batches.get(id);
  }

  updateBatch(id: string, updates: Partial<Batch>): Batch | undefined {
    const batch = this.batches.get(id);
    if (batch) {
      const updatedBatch = { ...batch, ...updates };
      this.batches.set(id, updatedBatch);
      return updatedBatch;
    }
    return undefined;
  }

  getBatchesByRunner(runnerId: string): Batch[] {
    return Array.from(this.batches.values()).filter(batch => batch.runnerId === runnerId);
  }

  // Menu methods
  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  getMenuItem(id: string): MenuItem | undefined {
    return this.menuItems.find(item => item.id === id);
  }

  // Contact methods
  submitContact(form: ContactForm): void {
    this.contactSubmissions.push(form);
  }

  getContactSubmissions(): ContactForm[] {
    return this.contactSubmissions;
  }

  // Utility methods
  getUnclaimedOrders(): Order[] {
    return Array.from(this.orders.values()).filter(
      order => order.status === 'preparing' && !order.runnerId
    );
  }

  claimOrder(orderId: string, runnerId: string): boolean {
    const order = this.orders.get(orderId);
    if (order && !order.runnerId) {
      order.runnerId = runnerId;
      order.lockTs = Date.now();
      return true;
    }
    return false;
  }

  releaseOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (order && order.runnerId) {
      order.runnerId = undefined;
      order.lockTs = undefined;
      return true;
    }
    return false;
  }
}

// Singleton instance
export const mockDb = new MockDatabase();
