import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateTax(subtotal: number, taxRate: number = 0.07): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

export function calculateServiceFee(): number {
  return 1.99;
}

export function calculateTotal(subtotal: number, tip: number, taxRate: number = 0.07): number {
  const tax = calculateTax(subtotal, taxRate);
  const serviceFee = calculateServiceFee();
  return Math.round((subtotal + tax + serviceFee + tip) * 100) / 100;
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateRunnerId(): string {
  return `RUN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function maskPhoneNumber(phone: string): string {
  if (phone.length < 4) return phone;
  const last4 = phone.slice(-4);
  return `(xxx) xxx-${last4}`;
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return email;
  const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
  return `${maskedLocal}@${domain}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'received':
      return 'bg-blue-100 text-blue-800';
    case 'preparing':
      return 'bg-yellow-100 text-yellow-800';
    case 'picked_up':
      return 'bg-purple-100 text-purple-800';
    case 'en_route':
      return 'bg-orange-100 text-orange-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getOrderStatusText(status: string): string {
  switch (status) {
    case 'received':
      return 'Order Received';
    case 'preparing':
      return 'Preparing';
    case 'picked_up':
      return 'Runner Picked Up';
    case 'en_route':
      return 'En Route';
    case 'delivered':
      return 'Delivered';
    default:
      return 'Unknown';
  }
}
