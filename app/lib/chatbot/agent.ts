import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, StateGraphArgs, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { chatbotTools, productRecommendationTool, addToCartTool, orderStatusTool, generalAssistanceTool } from "./tools";

// Define the state structure for our chatbot
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  userInput: Annotation<string>(),
  intent: Annotation<string>(),
  response: Annotation<string>(),
});

type ChatbotState = typeof StateAnnotation.State;

// Enhanced intent classification function
function classifyIntent(userInput: string): string {
  const input = userInput.toLowerCase();
  
  // Gratitude/politeness expressions (highest priority to avoid unwanted recommendations)
  const gratitudeKeywords = [
    'thank you', 'thanks', 'thx', 'appreciate', 'grateful',
    'bye', 'goodbye', 'see you', 'good day', 'take care'
  ];
  
  // Cart-related keywords (high priority)
  const cartKeywords = [
    'add to cart', 'buy', 'purchase', 'add ', 'cart', 'checkout'
  ];
  
  // Order-related keywords
  const orderKeywords = [
    'order', 'status', 'tracking', 'shipment', 'delivery', 'ord-',
    'when will', 'where is', 'track', 'shipped', 'delivered', 
    'order history', 'my orders', 'recent orders'
  ];
  
  // Product-related keywords
  const productKeywords = [
    'show me', 'find', 'recommend', 'looking for', 'need', 'want',
    'laptop', 'phone', 'headphone', 'computer', 'electronics', 
    'smartphone', 'wireless', 'bluetooth', 'gaming', 'under', 
    'below', 'price', 'cheap', 'expensive', 'product', 'camera',
    'watch', 'tablet', 'accessory', 'speaker', 'audio', 'all products',
    'show all', 'view all', 'list all', 'everything', 'entire catalog',
    'full catalog', 'complete list', 'browse all'
  ];
  
  // General assistance keywords
  const generalKeywords = [
    'hello', 'hi', 'hey', 'help', 'what can you', 'about', 'store',
    'service', 'how are you', 'good morning', 'good afternoon'
  ];
  
  // Check for gratitude expressions first (prevent unwanted recommendations)
  if (gratitudeKeywords.some(keyword => input.includes(keyword))) {
    return 'gratitude';
  }
  
  // Check for cart-related intent (high priority)
  if (cartKeywords.some(keyword => input.includes(keyword))) {
    // Additional check to ensure it's not just mentioning cart generally
    if (input.includes('add ') || input.includes('buy') || input.includes('purchase')) {
      return 'add_to_cart';
    }
  }
  
  // Check for order-related intent
  if (orderKeywords.some(keyword => input.includes(keyword))) {
    return 'order_status';
  }
  
  // Check for product-related intent
  if (productKeywords.some(keyword => input.includes(keyword))) {
    return 'product_recommendation';
  }
  
  // Check for general assistance intent
  if (generalKeywords.some(keyword => input.includes(keyword))) {
    return 'general_assistance';
  }
  
  // Default to general assistance for unclear queries (safer than product recommendations)
  return 'general_assistance';
}

// Intent classification node
async function intentClassifier(state: ChatbotState): Promise<Partial<ChatbotState>> {
  const lastMessage = state.messages[state.messages.length - 1];
  const userInput = lastMessage.content as string;
  const intent = classifyIntent(userInput);
  
  console.log(`Classified intent: ${intent} for input: "${userInput}"`);
  
  return {
    userInput,
    intent,
  };
}

// Product recommendation node
async function productRecommendationNode(state: ChatbotState): Promise<Partial<ChatbotState>> {
  console.log('Executing product recommendation...');
  
  try {
    const response = await productRecommendationTool.func(state.userInput);
    
    return {
      response,
      messages: [new AIMessage(response)],
    };
  } catch (error) {
    console.error('Error in product recommendation:', error);
    const errorResponse = "I'm sorry, I encountered an error while searching for products. Please try again or contact support.";
    
    return {
      response: errorResponse,
      messages: [new AIMessage(errorResponse)],
    };
  }
}

// Add to cart node
async function addToCartNode(state: ChatbotState): Promise<Partial<ChatbotState>> {
  console.log('Executing add to cart...');
  
  try {
    const response = await addToCartTool.func(state.userInput);
    
    return {
      response,
      messages: [new AIMessage(response)],
    };
  } catch (error) {
    console.error('Error in add to cart:', error);
    const errorResponse = "I'm sorry, I encountered an error while trying to add the item to your cart. Please try again or contact support.";
    
    return {
      response: errorResponse,
      messages: [new AIMessage(errorResponse)],
    };
  }
}

// Order status node
async function orderStatusNode(state: ChatbotState): Promise<Partial<ChatbotState>> {
  console.log('Executing order status check...');
  
  try {
    const response = await orderStatusTool.func(state.userInput);
    
    return {
      response,
      messages: [new AIMessage(response)],
    };
  } catch (error) {
    console.error('Error in order status check:', error);
    const errorResponse = "I'm sorry, I encountered an error while checking order information. Please try again or contact support.";
    
    return {
      response: errorResponse,
      messages: [new AIMessage(errorResponse)],
    };
  }
}

// General assistance node
async function generalAssistanceNode(state: ChatbotState): Promise<Partial<ChatbotState>> {
  console.log('Executing general assistance...');
  
  try {
    const response = await generalAssistanceTool.func(state.userInput);
    
    return {
      response,
      messages: [new AIMessage(response)],
    };
  } catch (error) {
    console.error('Error in general assistance:', error);
    return {
      response: "I'm here to help! Feel free to ask about our products, place orders, or get assistance with anything else.",
      messages: [new AIMessage("I'm here to help! Feel free to ask about our products, place orders, or get assistance with anything else.")],
    };
  }
}

// Gratitude node - handle thank you messages
async function gratitudeNode(state: ChatbotState): Promise<Partial<ChatbotState>> {
  console.log('Handling gratitude expression...');
  
  const gratitudeResponses = [
    "You're very welcome! 😊 Happy to help with your shopping needs anytime!",
    "My pleasure! 🛍️ Feel free to ask if you need anything else!",
    "You're welcome! 😊 Enjoy your shopping experience!",
    "Happy to help! 🚀 Come back anytime you need assistance!",
    "You're most welcome! 😊 Hope you find everything you're looking for!"
  ];
  
  // Pick a random response to make it feel more natural
  const response = gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)];
  
  return {
    response,
    messages: [new AIMessage(response)],
  };
}

// Routing function to direct intents to appropriate nodes
function routeIntent(state: ChatbotState): string {
  switch (state.intent) {
    case 'product_recommendation':
      return 'product_recommendation_node';
    case 'add_to_cart':
      return 'add_to_cart_node';
    case 'order_status':
      return 'order_status_node';
    case 'gratitude':
      return 'gratitude_node';
    case 'general_assistance':
      return 'general_assistance_node';
    default:
      // Fallback to general assistance for unknown intents
      return 'general_assistance_node';
  }
}

// Create the enhanced state graph with cart functionality
function createChatbotGraph() {
  const workflow = new StateGraph(StateAnnotation)
    // Add nodes
    .addNode("intent_classifier", intentClassifier)
    .addNode("product_recommendation_node", productRecommendationNode)
    .addNode("add_to_cart_node", addToCartNode)
    .addNode("order_status_node", orderStatusNode)
    .addNode("general_assistance_node", generalAssistanceNode)
    .addNode("gratitude_node", gratitudeNode) // Add gratitude node
    
    // Add edges
    .addEdge("__start__", "intent_classifier")
    .addConditionalEdges("intent_classifier", routeIntent, {
      "product_recommendation_node": "product_recommendation_node",
      "add_to_cart_node": "add_to_cart_node",
      "order_status_node": "order_status_node", 
      "general_assistance_node": "general_assistance_node",
      "gratitude_node": "gratitude_node", // Add edge for gratitude node
    })
    .addEdge("product_recommendation_node", "__end__")
    .addEdge("add_to_cart_node", "__end__")
    .addEdge("order_status_node", "__end__")
    .addEdge("general_assistance_node", "__end__")
    .addEdge("gratitude_node", "__end__"); // Add edge for gratitude node

  return workflow.compile();
}

// Main function to run the enhanced chatbot
export async function runChatbot(userMessage: string): Promise<string> {
  try {
    console.log(`Processing user message: "${userMessage}"`);
    
    const graph = createChatbotGraph();
    
    const initialState: ChatbotState = {
      messages: [new HumanMessage(userMessage)],
      userInput: userMessage,
      intent: '',
      response: '',
    };
    
    const result = await graph.invoke(initialState);
    
    console.log('Chatbot response generated successfully');
    return result.response || "I'm sorry, I couldn't process your request. Please try again.";
    
  } catch (error) {
    console.error('Error in chatbot execution:', error);
    return "I'm experiencing some technical difficulties. Please try again later or contact support for assistance.";
  }
}

// Enhanced OpenAI fallback with more comprehensive prompting
export async function runOpenAIFallback(userMessage: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return "I'm sorry, the AI service is not configured. Please contact support.";
    }

    const model = new ChatOpenAI({
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });

    const systemPrompt = `You are a helpful AI shopping assistant for a premium electronics e-commerce store with 60 products. 

STORE INVENTORY:
- 8 Laptops & Computers (gaming to business, $449-$2199)
- 12 Smartphones (budget to premium, $199-$1799) 
- 12 Audio Products (headphones, speakers, earbuds, $29-$499)
- 8 Wearables (smartwatches, fitness trackers, $49-$399)
- 6 Tablets (e-readers to pro tablets, $129-$799)
- 6 Cameras (action to professional, $99-$1299)
- 8 Accessories (keyboards, mice, hubs, $29-$119)

CAPABILITIES:
1. Product recommendations with detailed specs and pricing
2. Order status guidance (require login and order numbers)
3. Cart management help (require authentication)
4. Store navigation and general assistance

RESPONSE STYLE:
- Be enthusiastic and helpful
- Use emojis and formatting for better readability
- Provide specific product suggestions when possible
- Always mention authentication requirements for cart/orders
- Include price ranges and key features
- Guide users to appropriate actions

For product queries: Recommend specific items with prices and features
For cart requests: Mention login requirement and guide to authentication
For orders: Explain order number format and login needs
For general help: Provide comprehensive store overview`;

    const response = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]);

    return response.content as string;
    
  } catch (error) {
    console.error('Error in OpenAI fallback:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

// Export both the main chatbot and individual tools for flexibility
export { chatbotTools };
export default runChatbot;
