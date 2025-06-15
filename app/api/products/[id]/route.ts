import { NextResponse } from 'next/server';
import { products } from '../../../product-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = products.find(p => p.id === params.id);

    if (!product) {
      return new Response("Product not found", {
            status: 404,
        });
    }

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: {
            contentType: "application/json"
        }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 