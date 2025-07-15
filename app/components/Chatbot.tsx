'use client';

import { useState, useEffect, useRef } from 'react';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

type Product = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

function parseProducts(text: string): Product[] | null {
  if (!text.includes('🛍️')) return null;

  const blocks = text.split('---------------------').map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    const name = block.match(/🛍️ (.+)/)?.[1]?.trim() || '';
    const description = block.match(/\n(.+)\n💰/)?.[1]?.trim() || '';
    const price = block.match(/💰 (.+)/)?.[1]?.trim() || '';
    const imageUrl = block.match(/🔗 (.+)/)?.[1]?.trim() || '';
    return { name, description, price, imageUrl };
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: '❌ Error getting response' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h8M5 19a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="animate-fadeIn absolute bottom-16 right-0 w-96 max-h-[75vh] flex flex-col bg-white shadow-2xl border rounded-xl overflow-hidden">
          <div className="bg-blue-600 text-white text-center py-3 font-semibold">
            💬 Need Help? Ask Away!
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => {
              if (msg.role === 'bot') {
                const products = parseProducts(msg.text);
                if (products) {
                  return (
                    <div key={i}>
                      {products.map((product, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-white border rounded-lg shadow-sm">
                          <img src={product.imageUrl} alt={product.name} className="w-14 h-14 object-cover rounded" />
                          <div>
                            <h4 className="text-sm font-semibold">{product.name}</h4>
                            <p className="text-xs text-gray-600">{product.description}</p>
                            <p className="text-sm text-blue-600 font-bold mt-1">${product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
              }

              return (
                <div
                  key={i}
                  className={`px-4 py-2 max-w-[80%] text-sm rounded-lg ${
                    msg.role === 'user'
                      ? 'ml-auto bg-blue-100 text-gray-900'
                      : 'mr-auto bg-white border text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask about a product..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
