import { DynamicTool } from 'langchain/tools';
import { getProductsCollection } from '../../lib/db'; // Adjust path if needed

export const productRecommendationTool = new DynamicTool({
  name: 'product-recommendation',
  description: 'Suggests products based on search query like "Bluetooth speakers under $100"',
  func: async (input: string) => {
    const collection = await getProductsCollection();

    // Try a text index first
    let products = await collection
      .find({ $text: { $search: input } })
      .limit(5)
      .toArray();

    // Fallback: use regex if text search fails
    if (!products.length) {
      const regex = new RegExp(input.split(' ').join('|'), 'i');
      products = await collection
        .find({ $or: [{ name: regex }, { description: regex }] })
        .limit(5)
        .toArray();
    }

    if (!products.length) {
      return `I couldn't find any matching products. Try another keyword or category.`;
    }

    return products
      .map(
        (p) =>
          `🛍️ ${p.name}\n${p.description}\n💰 ${p.price}\n🔗 ${p.imageUrl}\n`
      )
      .join('\n---------------------\n');
  },
});
