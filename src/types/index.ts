// Stadium coordinate system
export type SectionCoord = {
  section: string;
  angleDeg: number;
  radius: number;
};

// Core data types
export type Order = {
  id: string;
  customerId: string;
  items: OrderItem[];
  seat: {
    section: string;
    row: string;
    seat: string;
  };
  contact: {
    method: 'email' | 'sms';
    value: string;
  };
  deliveryPrefs: {
    type: 'leave_at_seat' | 'handoff';
    notes?: string;
  };
  tip: {
    amount: number;
    percentage?: number;
  };
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  status: 'received' | 'preparing' | 'picked_up' | 'en_route' | 'delivered';
  runnerId?: string;
  lockTs?: number;
  createdAt: number;
  etaMinutes: number;
  paymentMethod: {
    type: 'card';
    last4: string;
  };
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

export type Runner = {
  id: string;
  name: string;
  isOnline: boolean;
  currentSection?: string;
  activeOrderIds: string[];
  earningsToday: number;
  completedDeliveries: number;
  onTimeRate: number;
  avgDeliveryTime: number;
};

export type Message = {
  id: string;
  orderId: string;
  sender: 'runner' | 'customer';
  text: string;
  ts: number;
  isTyping?: boolean;
};

export type Batch = {
  id: string;
  runnerId: string;
  orderIds: string[];
  createdAt: number;
  routeEstimateMinutes: number;
  totalPayout: number;
  status: 'active' | 'completed' | 'cancelled';
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

export type ContactForm = {
  name: string;
  email: string;
  message: string;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type OrderStatus = Order['status'];

export type DeliveryMethod = 'email' | 'sms';

export type DeliveryType = 'leave_at_seat' | 'handoff';

export type TipOption = {
  percentage: number;
  amount: number;
  label: string;
};

// Stadium sections mapping
export const STADIUM_SECTIONS: SectionCoord[] = [
  { section: '101', angleDeg: 0, radius: 50 },
  { section: '102', angleDeg: 18, radius: 50 },
  { section: '103', angleDeg: 36, radius: 50 },
  { section: '104', angleDeg: 54, radius: 50 },
  { section: '105', angleDeg: 72, radius: 50 },
  { section: '106', angleDeg: 90, radius: 50 },
  { section: '107', angleDeg: 108, radius: 50 },
  { section: '108', angleDeg: 126, radius: 50 },
  { section: '109', angleDeg: 144, radius: 50 },
  { section: '110', angleDeg: 162, radius: 50 },
  { section: '111', angleDeg: 180, radius: 50 },
  { section: '112', angleDeg: 198, radius: 50 },
  { section: '113', angleDeg: 216, radius: 50 },
  { section: '114', angleDeg: 234, radius: 50 },
  { section: '115', angleDeg: 252, radius: 50 },
  { section: '116', angleDeg: 270, radius: 50 },
  { section: '117', angleDeg: 288, radius: 50 },
  { section: '118', angleDeg: 306, radius: 50 },
  { section: '119', angleDeg: 324, radius: 50 },
  { section: '120', angleDeg: 342, radius: 50 },
];
