'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { CartItem, DeliveryMethod, DeliveryType, TipOption } from '@/types';
import { formatCurrency, calculateTax, calculateServiceFee, calculateTotal, validateEmail, validatePhone } from '@/lib/utils';

const tipOptions: TipOption[] = [
  { percentage: 10, amount: 0, label: '10%' },
  { percentage: 15, amount: 0, label: '15%' },
  { percentage: 20, amount: 0, label: '20%' },
  { percentage: 0, amount: 0, label: 'Custom' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [seatInfo, setSeatInfo] = useState({
    section: '',
    row: '',
    seat: ''
  });
  
  const [contactInfo, setContactInfo] = useState({
    method: 'email' as DeliveryMethod,
    value: ''
  });
  
  const [deliveryPrefs, setDeliveryPrefs] = useState({
    type: 'leave_at_seat' as DeliveryType,
    notes: ''
  });
  
  const [tip, setTip] = useState({
    percentage: 15,
    amount: 0,
    isCustom: false
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    // Load cart from localStorage or API
    const savedCart = localStorage.getItem('stadium-eats-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = calculateTax(subtotal);
  const serviceFee = calculateServiceFee();
  const tipAmount = tip.isCustom ? tip.amount : (subtotal * tip.percentage / 100);
  const total = calculateTotal(subtotal, tipAmount);

  const handleTipChange = (option: TipOption) => {
    if (option.label === 'Custom') {
      setTip({ percentage: 0, amount: 0, isCustom: true });
    } else {
      setTip({ percentage: option.percentage, amount: 0, isCustom: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!seatInfo.section || !seatInfo.row || !seatInfo.seat) {
      alert('Please enter your seat information');
      setIsSubmitting(false);
      return;
    }

    if (!contactInfo.value) {
      alert('Please enter your contact information');
      setIsSubmitting(false);
      return;
    }

    if (contactInfo.method === 'email' && !validateEmail(contactInfo.value)) {
      alert('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (contactInfo.method === 'sms' && !validatePhone(contactInfo.value)) {
      alert('Please enter a valid phone number');
      setIsSubmitting(false);
      return;
    }

    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.name) {
      alert('Please enter complete payment information');
      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        items: cart,
        seat: seatInfo,
        contact: contactInfo,
        deliveryPrefs,
        tip: { amount: tipAmount, percentage: tip.percentage },
        subtotal,
        tax,
        serviceFee,
        total,
        paymentMethod: {
          type: 'card' as const,
          last4: paymentInfo.cardNumber.slice(-4)
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        localStorage.removeItem('stadium-eats-cart');
        router.push(`/track/${order.id}`);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
          <Link href="/order" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/order" className="inline-flex items-center text-gray-100 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seat Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-accent mr-3" />
              <h2 className="text-xl font-semibold text-primary">Seat Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
                </label>
                <input
                  type="text"
                  id="section"
                  required
                  value={seatInfo.section}
                  onChange={(e) => setSeatInfo({ ...seatInfo, section: e.target.value })}
                  className="input"
                  placeholder="e.g., 105"
                />
              </div>
              <div>
                <label htmlFor="row" className="block text-sm font-medium text-gray-700 mb-2">
                  Row *
                </label>
                <input
                  type="text"
                  id="row"
                  required
                  value={seatInfo.row}
                  onChange={(e) => setSeatInfo({ ...seatInfo, row: e.target.value })}
                  className="input"
                  placeholder="e.g., A"
                />
              </div>
              <div>
                <label htmlFor="seat" className="block text-sm font-medium text-gray-700 mb-2">
                  Seat *
                </label>
                <input
                  type="text"
                  id="seat"
                  required
                  value={seatInfo.seat}
                  onChange={(e) => setSeatInfo({ ...seatInfo, seat: e.target.value })}
                  className="input"
                  placeholder="e.g., 12"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Mail className="h-6 w-6 text-accent mr-3" />
              <h2 className="text-xl font-semibold text-primary">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you like to receive updates? *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={contactInfo.method === 'email'}
                      onChange={(e) => setContactInfo({ ...contactInfo, method: e.target.value as DeliveryMethod })}
                      className="mr-2"
                    />
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="sms"
                      checked={contactInfo.method === 'sms'}
                      onChange={(e) => setContactInfo({ ...contactInfo, method: e.target.value as DeliveryMethod })}
                      className="mr-2"
                    />
                    <Phone className="h-4 w-4 mr-1" />
                    SMS
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="contactValue" className="block text-sm font-medium text-gray-700 mb-2">
                  {contactInfo.method === 'email' ? 'Email Address' : 'Phone Number'} *
                </label>
                <input
                  type={contactInfo.method === 'email' ? 'email' : 'tel'}
                  id="contactValue"
                  required
                  value={contactInfo.value}
                  onChange={(e) => setContactInfo({ ...contactInfo, value: e.target.value })}
                  className="input"
                  placeholder={contactInfo.method === 'email' ? 'your.email@example.com' : '(555) 123-4567'}
                />
              </div>
            </div>
          </div>

          {/* Delivery Preferences */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-accent mr-3" />
              <h2 className="text-xl font-semibold text-primary">Delivery Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Type *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="leave_at_seat"
                      checked={deliveryPrefs.type === 'leave_at_seat'}
                      onChange={(e) => setDeliveryPrefs({ ...deliveryPrefs, type: e.target.value as DeliveryType })}
                      className="mr-2"
                    />
                    Leave at seat (contactless)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="handoff"
                      checked={deliveryPrefs.type === 'handoff'}
                      onChange={(e) => setDeliveryPrefs({ ...deliveryPrefs, type: e.target.value as DeliveryType })}
                      className="mr-2"
                    />
                    Handoff to me personally
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={deliveryPrefs.notes}
                  onChange={(e) => setDeliveryPrefs({ ...deliveryPrefs, notes: e.target.value })}
                  className="input resize-none"
                  placeholder="Any special instructions for your runner..."
                />
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-6">Tip Your Runner</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {tipOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleTipChange(option)}
                  className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                    (tip.isCustom && option.label === 'Custom') || 
                    (!tip.isCustom && tip.percentage === option.percentage)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {tip.isCustom && (
              <div>
                <label htmlFor="customTip" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Tip Amount
                </label>
                <input
                  type="number"
                  id="customTip"
                  min="0"
                  step="0.01"
                  value={tip.amount}
                  onChange={(e) => setTip({ ...tip, amount: parseFloat(e.target.value) || 0 })}
                  className="input"
                  placeholder="0.00"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Tip amount: {formatCurrency(tipAmount)}
            </p>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-accent mr-3" />
              <h2 className="text-xl font-semibold text-primary">Payment Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  required
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  className="input"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    required
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                    className="input"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    required
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                    className="input"
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                  Name on Card *
                </label>
                <input
                  type="text"
                  id="cardName"
                  required
                  value={paymentInfo.name}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-700 font-medium">Secure checkout</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (7%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>{formatCurrency(tipAmount)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="spinner w-5 h-5 mr-2"></div>
                Placing Order...
              </>
            ) : (
              <>
                Place Order - {formatCurrency(total)}
                <CreditCard className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
