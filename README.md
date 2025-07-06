# Flash Commerce UI

A modern, full-featured e-commerce frontend built with React, TypeScript, and Tailwind CSS. The platform supports multi-role authentication (Buyer, Seller, Admin) with dedicated dashboards, product management, cart & checkout flows, and real-time order tracking.

## Tech Stack

| Layer           | Technology                           |
|-----------------|--------------------------------------|
| Framework       | React 18 with TypeScript             |
| Build Tool      | Vite 5 (SWC plugin)                 |
| Styling         | Tailwind CSS + shadcn/ui components  |
| State & Data    | TanStack React Query                 |
| Routing         | React Router DOM v6                  |
| Forms           | React Hook Form + Zod validation     |
| Charts          | Recharts                             |
| Icons           | Lucide React                         |
| Notifications   | Sonner + React Hot Toast             |

## Features

### Buyer Portal
- Browse and search products with filters
- Add to cart and manage cart items
- Place orders and track order status
- Accept/reject seller quotations

### Seller Portal
- View and respond to available orders
- Create and manage quotations
- Revenue analytics and performance metrics

### Admin Panel
- User management (buyers, sellers, admins)
- Platform-wide analytics and revenue tracking
- System health monitoring

## Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Installation

```bash
git clone https://github.com/avishkar-004/flash-commerce-ui.git
cd flash-commerce-ui
npm install
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
flash-commerce-ui/
├── public/                  # Static assets
├── src/
│   ├── auth/                # Authentication pages
│   ├── components/
│   │   ├── admin/           # Admin dashboard
│   │   ├── buyer/           # Buyer dashboard
│   │   ├── seller/          # Seller dashboard
│   │   └── ui/              # Reusable UI components (shadcn/ui)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Top-level pages
│   ├── utils/               # API client and helpers
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## License

This project is open-source and available under the [MIT License](LICENSE).
