# Stadium Eats - Premium In-Seat Food Delivery

A modern, responsive web application for premium in-seat food delivery service at sports stadiums. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Customer Portal
- **Home Page**: Hero section with clear value proposition and call-to-action
- **How It Works**: Step-by-step guide to the ordering process
- **Contact**: Contact form with validation and success feedback
- **Order**: Browse menu, add items to cart, and manage quantities
- **Checkout**: Complete order with seat information, contact preferences, tips, and payment
- **Tracking**: Real-time order tracking with status updates and ETA countdown
- **Messaging**: In-app chat with runners for real-time communication

### Runner Portal
- **Authentication**: Simple runner code/QR authentication system
- **Dashboard**: Overview of earnings, stats, and current status
- **Order Management**: View nearby orders, claim orders, and manage deliveries
- **Batching**: Group multiple orders for efficient delivery routes
- **Messaging**: Communicate with customers during delivery
- **Status Updates**: Update order status (picked up, en route, delivered)

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Real-time Updates**: Polling-based updates for order status and messaging
- **Mock APIs**: Complete backend simulation with in-memory database
- **Stadium Geography**: Coordinate system for distance calculations and batching
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context and local state
- **API**: Next.js API Routes with mock database

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aidanbunce/Fan-Grub-Money.git
cd Fan-Grub-Money
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Fan-Grub-Money/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── order/             # Order page
│   │   ├── checkout/          # Checkout page
│   │   ├── track/             # Order tracking
│   │   ├── runner/            # Runner portal
│   │   ├── how-it-works/      # How it works page
│   │   └── contact/           # Contact page
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions and configurations
│   │   ├── mock-db.ts         # In-memory database
│   │   ├── stadium-geo.ts     # Stadium coordinate system
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── README.md
```

## Stadium Geography System

The application includes a sophisticated stadium coordinate system for distance calculations and order batching:

### Section Mapping
- Stadium sections are mapped to polar coordinates (angle + radius)
- 20 sample sections (101-120) with 18-degree spacing
- Each section has a centroid for distance calculations

### Distance Calculation
- Uses law of cosines for polar coordinates
- Approximates real-world distances in meters
- Supports batching orders within configurable radius

### Configuration
```typescript
// Modify STADIUM_SECTIONS in src/types/index.ts
export const STADIUM_SECTIONS: SectionCoord[] = [
  { section: '101', angleDeg: 0, radius: 50 },
  { section: '102', angleDeg: 18, radius: 50 },
  // ... more sections
];
```

## API Endpoints

### Customer APIs
- `GET /api/menu` - Fetch menu items
- `POST /api/orders` - Create new order
- `GET /api/orders/[orderId]` - Get order details
- `PATCH /api/orders/[orderId]` - Update order
- `GET /api/orders/[orderId]/messages` - Get order messages
- `POST /api/orders/[orderId]/messages` - Send message
- `POST /api/contact` - Submit contact form

### Runner APIs
- `POST /api/runner/login` - Runner authentication
- `GET /api/runner/me` - Get runner profile
- `PATCH /api/runner/status` - Update online/offline status
- `GET /api/orders/nearby` - Get nearby unclaimed orders
- `POST /api/runner/claim` - Claim an order
- `POST /api/runner/batch` - Create/update batch
- `PATCH /api/runner/orders/[orderId]` - Update order status

## Configuration

### Batching Parameters
Modify these values in the runner dashboard and API routes:

```typescript
// Maximum distance for batching (meters)
const MAX_BATCH_DISTANCE = 120;

// Maximum orders per batch
const MAX_BATCH_SIZE = 3;

// Maximum delivery time window (minutes)
const MAX_DELIVERY_WINDOW = 12;
```

### Polling Intervals
```typescript
// Order status polling (milliseconds)
const ORDER_POLL_INTERVAL = 10000; // 10 seconds

// Nearby orders polling (milliseconds)
const NEARBY_ORDERS_POLL_INTERVAL = 5000; // 5 seconds

// Message polling (milliseconds)
const MESSAGE_POLL_INTERVAL = 10000; // 10 seconds
```

## Mock Data

The application includes comprehensive mock data:

### Menu Items
- 8 sample menu items across different categories
- Realistic pricing and descriptions
- Availability status

### Runners
- 2 sample runners with different stats
- Earnings, completion rates, and performance metrics
- Online/offline status management

### Orders
- Sample orders with various statuses
- Realistic timing and ETA calculations
- Customer and runner interactions

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG compliant color combinations
- **Responsive Design**: Works on all device sizes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Code Style

- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript strict mode enabled
- Consistent naming conventions

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Future Enhancements

### Real Integrations
- **Payment Processing**: Stripe integration for real payments
- **SMS/Email**: Twilio and SendGrid for notifications
- **WebSockets**: Real-time updates instead of polling
- **Maps**: Google Maps or Mapbox for stadium navigation
- **Push Notifications**: Browser notifications for order updates

### Advanced Features
- **Multi-stadium Support**: Support for different stadium layouts
- **Dynamic Pricing**: Time-based pricing adjustments
- **Inventory Management**: Real-time menu availability
- **Analytics Dashboard**: Business intelligence and reporting
- **Mobile App**: React Native companion app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Email: support@stadiumeats.com
- Phone: 1-800-STADIUM
- Website: [Contact Page](/contact)

---

Built with ❤️ for sports fans everywhere
