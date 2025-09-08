'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  ToggleLeft, 
  ToggleRight,
  Plus,
  Navigation,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Runner, Order } from '@/types';
import { formatCurrency, calculateSectionDistance } from '@/lib/utils';

export default function RunnerDashboard() {
  const router = useRouter();
  const [runner, setRunner] = useState<Runner | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [nearbyOrders, setNearbyOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runnerId = localStorage.getItem('stadium-eats-runner-id');
    if (!runnerId) {
      router.push('/runner');
      return;
    }

    fetchRunnerData(runnerId);
    
    // Set up polling for nearby orders
    const interval = setInterval(() => {
      if (isOnline) {
        fetchNearbyOrders(runnerId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline, router]);

  const fetchRunnerData = async (runnerId: string) => {
    try {
      const response = await fetch(`/api/runner/me?runnerId=${runnerId}`);
      if (response.ok) {
        const runnerData = await response.json();
        setRunner(runnerData);
        setIsOnline(runnerData.isOnline);
      }
    } catch (error) {
      console.error('Error fetching runner data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNearbyOrders = async (runnerId: string) => {
    try {
      const response = await fetch(`/api/orders/nearby?runnerId=${runnerId}`);
      if (response.ok) {
        const orders = await response.json();
        setNearbyOrders(orders);
      }
    } catch (error) {
      console.error('Error fetching nearby orders:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    if (!runner) return;

    try {
      const response = await fetch('/api/runner/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          runnerId: runner.id, 
          isOnline: !isOnline 
        }),
      });

      if (response.ok) {
        setIsOnline(!isOnline);
        if (!isOnline) {
          fetchNearbyOrders(runner.id);
        } else {
          setNearbyOrders([]);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const claimOrder = async (orderId: string) => {
    if (!runner) return;

    try {
      const response = await fetch('/api/runner/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          runnerId: runner.id, 
          orderId 
        }),
      });

      if (response.ok) {
        fetchNearbyOrders(runner.id);
        // Refresh runner data to update active orders
        fetchRunnerData(runner.id);
      } else {
        alert('Failed to claim order. It may have been claimed by another runner.');
      }
    } catch (error) {
      console.error('Error claiming order:', error);
    }
  };

  const getOrderAge = (createdAt: number) => {
    const minutes = Math.floor((Date.now() - createdAt) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!runner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-4">Runner Not Found</h1>
          <p className="text-gray-600 mb-6">Unable to load runner information.</p>
          <button
            onClick={() => router.push('/runner')}
            className="btn-primary"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Runner Dashboard</h1>
              <p className="text-gray-100">Welcome back, {runner.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-100">Status</div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="font-medium">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleOnlineStatus}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                {isOnline ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
                <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-primary mb-4">Today's Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-accent mr-2" />
                    <span className="text-gray-600">Earnings</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(runner.earningsToday)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-accent mr-2" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold">{runner.completedDeliveries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-accent mr-2" />
                    <span className="text-gray-600">Avg Time</span>
                  </div>
                  <span className="font-semibold">{runner.avgDeliveryTime}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-accent mr-2" />
                    <span className="text-gray-600">On-time Rate</span>
                  </div>
                  <span className="font-semibold">{(runner.onTimeRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Current Location */}
            <div className="card">
              <h2 className="text-lg font-semibold text-primary mb-4">Current Location</h2>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-accent mr-2" />
                <span className="text-gray-600">
                  {runner.currentSection ? `Section ${runner.currentSection}` : 'Not set'}
                </span>
              </div>
            </div>

            {/* Active Orders */}
            {runner.activeOrderIds.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-primary mb-4">Active Orders</h2>
                <div className="space-y-2">
                  {runner.activeOrderIds.map(orderId => (
                    <div key={orderId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Order #{orderId.slice(-6)}</span>
                      <span className="text-xs text-gray-500">In Progress</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nearby Orders */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-primary">Nearby Orders</h2>
                {!isOnline && (
                  <div className="text-sm text-gray-500">
                    Go online to see available orders
                  </div>
                )}
              </div>

              {!isOnline ? (
                <div className="text-center py-12">
                  <ToggleLeft className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You're currently offline</p>
                  <p className="text-sm text-gray-400">Toggle online to start receiving orders</p>
                </div>
              ) : nearbyOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders available</p>
                  <p className="text-sm text-gray-400">Check back in a few minutes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nearbyOrders.map(order => {
                    const distance = runner.currentSection 
                      ? calculateSectionDistance(runner.currentSection, order.seat.section)
                      : 0;

                    return (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-primary">
                              Order #{order.id.slice(-6)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {order.items.length} items • {getOrderAge(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-accent">
                              {formatCurrency(order.total + order.tip.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {distance > 0 ? `${distance}m away` : 'Distance unknown'}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <div className="font-medium">
                              Section {order.seat.section}, Row {order.seat.row}, Seat {order.seat.seat}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Items:</span>
                            <div className="font-medium">
                              {order.items.map(item => item.name).join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              ETA: {order.etaMinutes}m
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Tip: {formatCurrency(order.tip.amount)}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="btn-secondary text-sm px-3 py-1">
                              <Navigation className="h-4 w-4 mr-1" />
                              Route
                            </button>
                            <button
                              onClick={() => claimOrder(order.id)}
                              className="btn-accent text-sm px-3 py-1"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Claim
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
