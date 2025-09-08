import { ArrowRight, Clock, MapPin, Smartphone, CreditCard, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Smartphone,
      title: 'Browse & Order',
      description: 'Open Stadium Eats on your phone and browse our menu of fresh stadium favorites. Select your items and enter your exact seat location.',
      details: [
        'View real-time menu availability',
        'See prices and descriptions',
        'Enter section, row, and seat number',
        'Choose delivery preferences'
      ]
    },
    {
      icon: CreditCard,
      title: 'Secure Checkout',
      description: 'Complete your order with secure payment processing. Add a tip for your runner and choose how you want to receive updates.',
      details: [
        'Safe payment processing',
        'Add tip for your runner',
        'Choose email or SMS updates',
        'Get order confirmation'
      ]
    },
    {
      icon: Clock,
      title: 'Track Your Order',
      description: 'Watch your order progress in real-time. See when it\'s being prepared, picked up by a runner, and delivered to your seat.',
      details: [
        'Real-time order tracking',
        'ETA countdown timer',
        'Runner location updates',
        'Live status notifications'
      ]
    },
    {
      icon: MapPin,
      title: 'Receive Delivery',
      description: 'Our professional runners navigate the stadium to deliver your food directly to your seat. Choose between contactless or handoff delivery.',
      details: [
        'Direct to seat delivery',
        'Contactless or handoff options',
        'Photo confirmation available',
        'Professional service'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How Stadium Eats Works
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Getting your favorite stadium food delivered to your seat is simple, fast, and reliable
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                      <step.icon className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                        Step {index + 1}
                      </span>
                      <h2 className="text-3xl font-bold text-primary">
                        {step.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <div className="text-center">
                      <step.icon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Step {index + 1} Illustration</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Stadium Eats?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make stadium food delivery simple, fast, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Average delivery time of 8-12 minutes from order to your seat
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Precise Location</h3>
              <p className="text-gray-600">
                Our runners know every section, row, and seat in the stadium
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Fresh Food</h3>
              <p className="text-gray-600">
                Hot, fresh food from the best stadium vendors and kitchens
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Easy Ordering</h3>
              <p className="text-gray-600">
                Simple mobile interface designed for stadium use
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Safe and secure payment processing with order protection
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your order from kitchen to seat with live updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Try Stadium Eats?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Experience the convenience of premium food delivery at your next game
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="btn-accent text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              Start Your Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="btn-secondary text-lg px-8 py-4"
            >
              Have Questions?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
