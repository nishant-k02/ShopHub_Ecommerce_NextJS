import { MongoClient } from 'mongodb';
import { products } from '../app/product-data';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

// Extract database name from connection string or use default
const getDatabaseName = (uri: string) => {
  const match = uri.match(/\/\/([^\/]+)\/([^?]+)/);
  if (match && match[2]) {
    return match[2];
  }
  return process.env.MONGODB_DB_NAME || 'ecommerce';
};

async function seedDatabase() {
  // MONGODB_URI is guaranteed to be defined at this point due to the check above
  const client = new MongoClient(MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  });
  
  try {
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully');

    const dbName = getDatabaseName(MONGODB_URI!);
    const db = client.db(dbName);
    const collection = db.collection('products');

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await collection.deleteMany({});
    console.log('✅ Cleared existing products');

    // Insert products
    console.log('📦 Inserting products...');
    const result = await collection.insertMany(products);
    console.log(`✅ Inserted ${result.insertedCount} products`);

    // Create indexes for better performance
    console.log('🔍 Creating database indexes...');
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ name: 'text', description: 'text' });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ price: 1 });
    console.log('✅ Created indexes');

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Database: ${dbName}`);
    console.log(`📈 Products: ${result.insertedCount}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

seedDatabase(); 