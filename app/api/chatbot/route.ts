import { NextRequest, NextResponse } from 'next/server';
import { runChatbot, runOpenAIFallback } from '../../lib/chatbot/agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, useOpenAI = false } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Trim and validate message length
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 1000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 1000 characters.' },
        { status: 400 }
      );
    }

    console.log('Chatbot API received message:', trimmedMessage);

    let response: string;

    try {
      // Use LangGraph-based chatbot by default
      if (useOpenAI) {
        response = await runOpenAIFallback(trimmedMessage);
      } else {
        response = await runChatbot(trimmedMessage);
      }
    } catch (error) {
      console.error('Primary chatbot failed, trying fallback:', error);
      // Fallback to OpenAI if LangGraph fails
      response = await runOpenAIFallback(trimmedMessage);
    }

    // Log successful response (truncated for logs)
    console.log('Chatbot response generated:', response.substring(0, 100) + '...');

    // Try to parse response as JSON for structured data
    let responseData;
    try {
      responseData = JSON.parse(response);
      // If it's structured data with products
      if (responseData.text && responseData.products) {
        return NextResponse.json({
          message: responseData.text,
          products: responseData.products,
          timestamp: new Date().toISOString(),
          success: true
        });
      }
    } catch (parseError) {
      // Not JSON, treat as plain text
    }

    // Return plain text response
    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
      success: true
    });

  } catch (error) {
    console.error('Error in chatbot API:', error);
    
    return NextResponse.json({
      error: 'I apologize, but I\'m experiencing technical difficulties right now. Please try again in a moment or contact our support team for assistance.',
      timestamp: new Date().toISOString(),
      success: false
    }, { status: 500 });
  }
}

// Handle GET requests for API documentation
export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: 'E-commerce Chatbot API',
    description: 'AI-powered chatbot for product recommendations and order status queries',
    version: '1.0.0',
    endpoints: {
      POST: {
        description: 'Send a message to the chatbot',
        body: {
          message: 'string (required) - The user message to process',
          useOpenAI: 'boolean (optional) - Whether to use OpenAI fallback instead of LangGraph'
        },
        response: {
          message: 'string - The chatbot response',
          timestamp: 'string - ISO timestamp of the response',
          success: 'boolean - Whether the request was successful'
        }
      }
    },
    capabilities: [
      'Product recommendations based on user queries',
      'Order status information and guidance',
      'General store assistance and navigation help',
      'Price-based product filtering',
      'Category-based product searches'
    ],
    examples: {
      product_query: 'Show me wireless headphones under $100',
      order_query: 'What\'s the status of my order ORD-12345-67890?',
      general_query: 'Hello, what can you help me with?'
    }
  });
}
