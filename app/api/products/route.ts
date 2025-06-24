import { NextResponse } from 'next/server';
import { getProductsCollection } from '../../lib/db';

export async function GET(request: Request) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const collection = await getProductsCollection();

    // Build the filter object
    const filter: any = {};
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build the sort object
    let sortObj: any = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortObj.price = 1;
          break;
        case 'price_desc':
          sortObj.price = -1;
          break;
        case 'name_asc':
          sortObj.name = 1;
          break;
        case 'name_desc':
          sortObj.name = -1;
          break;
        default:
          break;
      }
    }

    // Get total count for pagination
    const totalItems = await collection.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated products
    const products = await collection
      .find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Return the response with pagination metadata
    return NextResponse.json({
      products,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 