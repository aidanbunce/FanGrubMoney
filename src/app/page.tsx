import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Shield, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center justify-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Never Miss a Moment
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100">
              Premium in-seat food delivery service for sports stadiums. 
              Enjoy your favorite stadium food without leaving your seat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/order"
                className="btn-accent text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Order Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/how-it-works"
                className="btn-secondary text-lg px-8 py-4"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Stadium Eats?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the convenience of premium food delivery right to your seat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center slide-up">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered to your seat in minutes, not hours
              </p>
            </div>

            <div className="text-center slide-up">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Precise Location</h3>
              <p className="text-gray-600">
                Our runners know the stadium layout and find your exact seat
              </p>
            </div>

            <div className="text-center slide-up">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Safe and secure payment processing with order tracking
              </p>
            </div>

            <div className="text-center slide-up">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Fresh, hot food from the best stadium vendors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting your favorite stadium food has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Place Your Order</h3>
              <p className="text-gray-600">
                Browse our menu, select your items, and provide your seat location
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Track Your Order</h3>
              <p className="text-gray-600">
                Watch as your order is prepared and delivered by our professional runners
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Enjoy Your Food</h3>
              <p className="text-gray-600">
                Receive your hot, fresh food right at your seat without missing any action
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/how-it-works"
              className="btn-primary text-lg px-8 py-4"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Never Miss a Moment?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of sports fans who trust Stadium Eats for their game-day food delivery
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
              href="/runner"
              className="btn-secondary text-lg px-8 py-4"
            >
              Become a Runner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
