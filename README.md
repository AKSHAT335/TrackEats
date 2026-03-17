# TrackEats 🍔📦

A modern, full-stack food delivery application with real-time tracking, admin management, and delivery personnel coordination. Built with Next.js, Node.js, MongoDB, and WebSocket technology for seamless order management and live location tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Features Guide](#features-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

TrackEats is a comprehensive food delivery platform that connects customers, administrators, and delivery personnel in a unified ecosystem. The application features real-time order tracking, intelligent delivery assignment, instant messaging between delivery partners and customers, and a robust admin panel for managing inventory and orders.

The system is divided into two main components:
- **Frontend Application** (Next.js): User interface for customers, admins, and delivery personnel
- **Socket Server** (Node.js + Express): Real-time communication backbone for live tracking and messaging

## ✨ Features

### For Customers
- User registration and authentication
- Browse grocery items by category
- Add items to cart and checkout
- Order placement with real-time confirmation
- Real-time order tracking with live delivery map
- Order history and status management
- Instant messaging with delivery personnel
- Multiple payment options (Razorpay integration)
- OTP verification for secure deliveries

### For Admins
- Comprehensive dashboard with order analytics
- Add, edit, and manage grocery inventory
- View and manage all orders
- Order status updates and management
- Monitor delivery assignments
- Real-time order metrics and insights

### For Delivery Personnel
- Mobile-friendly role selection interface
- View available delivery assignments
- Accept or decline orders
- Real-time location tracking
- Live communication with customers
- OTP-based delivery verification
- Order history and earnings tracking

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.2.1
- **State Management**: Redux Toolkit 2.11.2
- **Maps**: Leaflet + React Leaflet + Leaflet GeoSearch
- **Real-time**: Socket.io Client 4.8.3
- **Authentication**: NextAuth 5.0.0-beta.30
- **UI Components**: Lucide React, Motion
- **Charts**: Recharts 3.7.0
- **HTTP Client**: Axios 1.13.4

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Language**: JavaScript
- **Database**: MongoDB 9.1.6 (via Mongoose)
- **Real-time**: Socket.io 4.8.3
- **Authentication**: bcryptjs 3.0.3
- **Email**: Nodemailer 7.0.11
- **File Storage**: Cloudinary
- **Payment**: Razorpay 2.9.6

### Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Development**: Nodemon 3.1.11

## 📁 Project Structure

```
TrackEats-main/
├── trackeats/                          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                   # API routes
│   │   │   │   ├── admin/            # Admin endpoints
│   │   │   │   ├── user/             # User endpoints
│   │   │   │   ├── delivery/         # Delivery endpoints
│   │   │   │   ├── chat/             # Chat endpoints
│   │   │   │   └── auth/             # Authentication
│   │   │   ├── admin/                # Admin pages
│   │   │   ├── user/                 # User pages
│   │   │   ├── login/                # Login page
│   │   │   ├── register/             # Registration page
│   │   │   └── components/           # React components
│   │   ├── lib/                      # Utilities
│   │   │   ├── db.ts                # MongoDB connection
│   │   │   ├── socket.ts            # Socket.io setup
│   │   │   ├── mailer.ts            # Email service
│   │   │   └── cloudinary.ts        # Image upload
│   │   ├── models/                  # Mongoose schemas
│   │   ├── redux/                   # Redux store
│   │   ├── hooks/                   # Custom React hooks
│   │   └── auth.ts                  # NextAuth configuration
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
└── socketServer/                     # Node.js Socket Server
    ├── index.js                     # Main server file
    ├── package.json
    └── .env                         # Environment variables
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (v5.0 or higher) - local or cloud (MongoDB Atlas)
- **Git** for version control

### Optional Services
- **Cloudinary Account**: For image uploads
- **Razorpay Account**: For payment processing
- **Gmail Account**: For email notifications (SMTP setup)

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/TrackEats.git
cd TrackEats
```

### Step 2: Frontend Setup
```bash
cd trackeats
npm install
```

### Step 3: Socket Server Setup
```bash
cd ../socketServer
npm install
```

### Step 4: Create Environment Files

Create `.env.local` in the `trackeats/` directory:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackeats

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_SECRET_KEY=your-razorpay-secret

# Email Service
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Socket Server
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

Create `.env` in the `socketServer/` directory:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackeats

# Server
PORT=4000
NODE_ENV=development
```

## ⚙️ Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
4. Update `MONGODB_URI` in both `.env.local` and `.env`

### Google OAuth Setup
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project
3. Enable OAuth 2.0
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Client Secret to `.env.local`

### Cloudinary Setup (for image uploads)
1. Sign up at https://cloudinary.com/
2. Get your Cloud Name, API Key, and API Secret
3. Update the environment variables

### Razorpay Setup (for payments)
1. Create a Razorpay account at https://razorpay.com/
2. Get your Key ID and Secret Key from dashboard
3. Update the environment variables

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Frontend (Next.js)**
```bash
cd trackeats
npm run dev
```
Access at: http://localhost:3000

**Terminal 2 - Socket Server**
```bash
cd socketServer
npm run dev
```
Server running at: http://localhost:4000

### Production Build

**Frontend**
```bash
cd trackeats
npm run build
npm start
```

**Socket Server**
```bash
cd socketServer
node index.js
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth routes
- `GET /api/me` - Get current user

### User Orders
- `GET /api/user/my-orders` - Get user's orders
- `POST /api/user/order` - Create new order
- `GET /api/user/get-order/[orderId]` - Get order details
- `POST /api/user/payment` - Process payment
- `POST /api/user/verify-payment` - Verify payment

### Admin Management
- `GET /api/admin/get-groceries` - List all groceries
- `POST /api/admin/add-grocery` - Add new grocery item
- `PUT /api/admin/edit-grocery` - Edit grocery item
- `DELETE /api/admin/delete-grocery` - Delete grocery item
- `GET /api/admin/get-orders` - List all orders
- `PUT /api/admin/update-order-status/[orderId]` - Update order status

### Delivery
- `GET /api/delivery/get-assignments` - Get delivery assignments
- `POST /api/delivery/assignment/[id]/accept-assignment` - Accept assignment
- `GET /api/delivery/current-order` - Get current delivery order
- `POST /api/delivery/otp/send` - Send OTP
- `POST /api/delivery/otp/verify` - Verify OTP

### Chat
- `POST /api/chat/messages` - Send message
- `POST /api/chat/ai-suggestions` - Get AI suggestions
- `POST /api/chat/save` - Save chat

## 🔐 Environment Variables

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NEXTAUTH_URL` | NextAuth callback URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Any random string |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | From Google Console |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Your cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key ID | From Razorpay |
| `RAZORPAY_SECRET_KEY` | Razorpay secret key | From Razorpay |
| `EMAIL_USER` | Gmail address for notifications | your-email@gmail.com |
| `EMAIL_PASS` | Gmail app-specific password | Generated from Google Account |
| `NEXT_PUBLIC_SOCKET_URL` | Socket server URL | `http://localhost:4000` |

### Socket Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Socket server port | `4000` |
| `NODE_ENV` | Environment | `development` or `production` |

## 📖 Features Guide

### User Registration & Login
1. Navigate to `/register`
2. Choose role: Customer, Admin, or Delivery Personnel
3. Enter credentials and verify email
4. Log in with credentials or Google OAuth

### Placing an Order (Customer)
1. Browse groceries on homepage
2. Filter by category using the slider
3. Add items to cart
4. Go to cart and proceed to checkout
5. Select delivery address and payment method
6. Complete payment via Razorpay
7. Track order in real-time

### Delivery Tracking
1. Orders appear on customer's "Track Order" page
2. Real-time delivery location shows on interactive map
3. Chat with delivery personnel in real-time
4. OTP verification upon delivery

### Admin Dashboard
1. View all orders and their statuses
2. Manage grocery inventory
3. Update order statuses
4. View order analytics and metrics

### Delivery Personnel
1. View available assignments
2. Accept orders to start delivery
3. Update location in real-time
4. Communicate with customers
5. Verify delivery with OTP

## 🚢 Deployment

### Frontend Deployment (Vercel)
```bash
cd trackeats
npm install -g vercel
vercel
```

### Socket Server Deployment
- **Heroku**: Use `Procfile` and deploy to Heroku
- **Railway**: Connect GitHub repo and deploy
- **AWS**: Deploy to EC2 instance
- **DigitalOcean**: App Platform deployment

### Database Deployment
Use MongoDB Atlas (cloud) for production database.

## 🐛 Troubleshooting

### Issue: Socket Connection Failed
**Solution**: Ensure socket server is running and `NEXT_PUBLIC_SOCKET_URL` is correct.

### Issue: MongoDB Connection Error
**Solution**: 
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure database user has proper permissions

### Issue: Payment Integration Not Working
**Solution**:
- Verify Razorpay credentials are correct
- Check webhook URL is properly configured
- Ensure callback function is implemented

### Issue: Images Not Uploading
**Solution**:
- Verify Cloudinary credentials
- Check image file size is within limits
- Ensure Cloudinary API is accessible

### Issue: Email Not Sending
**Solution**:
- Use Gmail app-specific password (not regular password)
- Enable "Less secure apps" in Google Account (if not using app password)
- Verify EMAIL_USER and EMAIL_PASS are correct

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

### Coding Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Document complex functions

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email support@trackeats.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Socket.io for real-time communication
- All contributors and supporters

---

**Happy coding! 🎉**

Last updated: March 2025
