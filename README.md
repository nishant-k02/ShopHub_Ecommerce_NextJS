# 🛒 **ShopHub** - Modern E-commerce Platform

A full-stack e-commerce platform built with Next.js 15, featuring an AI-powered shopping assistant, complete user management, and a modern, responsive interface.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## 🌟 **Features**

### 🔐 **Authentication & User Management**
- **Secure Authentication**: JWT-based auth with HTTP-only cookies
- **User Registration & Login**: Complete signup/login flow with validation
- **Profile Management**: Update personal information and change passwords
- **Session Management**: Persistent login sessions with automatic refresh

### 🛍️ **Shopping Experience**
- **Product Catalog**: 60 products across 7 categories (Electronics, Laptops, Smartphones, Audio, Wearables, Tablets, Cameras, Accessories)
- **Advanced Search & Filtering**: Search by name, filter by category, sort by price/popularity
- **Product Details**: Comprehensive product pages with specifications, reviews, and related products
- **Shopping Cart**: Add/remove items, quantity management, persistent cart (requires login)
- **Wishlist**: Save items for later purchase (requires login)
- **Price Range**: Products from $29 to $2199 covering all budgets

### 🤖 **AI-Powered Shopping Assistant**
- **LangChain Integration**: Advanced AI chatbot powered by OpenAI GPT-3.5-turbo
- **Smart Product Recommendations**: Natural language product discovery
- **Cart Management**: Add products to cart directly through chat
- **Order Tracking**: Real-time order status updates via chat
- **24/7 Availability**: Instant customer support and product assistance

### 💳 **Checkout & Payments**
- **Secure Checkout**: Complete checkout flow with address and payment validation
- **Payment Methods**: Save and manage multiple payment methods
- **Order Processing**: Real-time order creation and confirmation
- **Tax & Shipping**: Automatic calculation with transparent pricing

### 📦 **Order Management**
- **Order History**: Complete order tracking and history
- **Real-time Status**: Track orders from pending to delivered
- **Order Cancellation**: Cancel orders before shipping
- **Detailed Receipts**: Comprehensive order summaries with itemization

### 🎨 **Modern User Interface**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Elegant loading animations and error handling

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Beautiful SVG icons

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB Atlas** - Cloud database
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing

### **AI & Automation**
- **LangChain** - AI framework for intelligent conversations
- **OpenAI GPT-3.5-turbo** - Natural language processing
- **LangGraph** - Advanced conversation flow management

### **State Management**
- **React Context API** - Global state management
- **Custom Hooks** - Reusable state logic

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- OpenAI API key (for AI chatbot)

### **Environment Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb_credentials

   # JWT Secret for authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # OpenAI API Key for AI chatbot
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

### **Database Initialization**

1. **Seed the database with sample products**
   ```bash
   npm run seed
   ```

### **Run the Application**

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Start shopping and test the AI chatbot!

```

## 🔧 **Available Scripts**

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run seed         # Seed database with sample products
```


## 🎯 **Key Features Showcase**

### **AI Shopping Assistant**
- Natural language product search: *"Show me gaming laptops under $1000"*
- Smart recommendations based on user needs
- Direct cart integration: *"Add laptop-001 to cart"*
- Order tracking: *"Check order ORD-12345-67890"*


## 🔒 **Security Features**

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** with bcryptjs
- **Input Validation** on all endpoints
- **Protected Routes** for authenticated features
- **Secure Session Management**

## 🚀 **Deployment**

### **Environment Variables for Production**
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secure-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
```

### **Build for Production**
```bash
npm run build
npm run start
```

---

**Built with ❤️ using Next.js, MongoDB, and OpenAI**
