# E-commerce Website

A modern e-commerce website built with Next.js, TypeScript, Tailwind CSS, and MongoDB Atlas.

## Features

- Modern, responsive UI with Tailwind CSS
- Product catalog with search, filtering, and pagination
- Shopping cart functionality
- Product detail pages
- Toast notifications
- MongoDB Atlas integration for data persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier available)

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Free tier is sufficient)

2. **Configure Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

4. **Get Connection String**:
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongod_credentials
   ```
   
   Replace:
   - `your_username` with your MongoDB Atlas username
   - `your_password` with your MongoDB Atlas password
   - `your_cluster` with your actual cluster name
   - `ecommerce` with your desired database name

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses MongoDB Atlas for data persistence. The database includes:

- **Products collection**: Stores product information with indexes for efficient querying
- **Cart collection**: Stores shopping cart data

### Database Schema

#### Products
```typescript
{
  _id: ObjectId,
  id: string,
  imageUrl: string,
  name: string,
  description: string,
  price: number,
  category?: string
}
```

#### Cart Items
```typescript
{
  _id: ObjectId,
  id: string,
  productId: string,
  quantity: number,
  name: string,
  price: number,
  imageUrl: string
}
```

## API Endpoints

- `GET /api/products` - List products with filtering, sorting, and pagination
- `GET /api/products/[id]` - Get individual product details
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart

## Environment Variables

Create a `.env.local` file with:

```env
# MongoDB Atlas Connection String
MONGODB_URI=""

# Optional: Database name (if not specified in connection string)
MONGODB_DB_NAME=ecommerce
```

## Project Structure

```
ecommerce/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── context/       # React context providers
│   ├── lib/           # Database utilities
│   └── products/      # Product pages
├── scripts/           # Database seeding scripts
└── public/            # Static assets
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MongoDB Atlas** - Cloud database
- **React Context** - State management

## Troubleshooting

### Connection Issues
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check that your username and password are correct
- Verify the cluster name in your connection string

### Database Seeding
- Run `npm run seed` to populate the database
- Check the console output for any errors
- Ensure your `.env.local` file is in the root directory

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
