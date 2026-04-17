import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, ShoppingBag, TrendingUp, Tag, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { products } from '../data/products';
import { useBehavior } from '../contexts/BehaviorContext';
import { callGeminiAPI, sanitizeInput } from '../utils/gemini';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
  suggestions?: string[];
  products?: typeof products;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hi! I'm your NeuroCart AI shopping assistant powered by Google Gemini. I can help you:\n\n• Find products within your budget\n• Compare similar products\n• Get personalized recommendations\n• Find the best deals\n\nWhat are you looking for today?",
      timestamp: Date.now(),
      suggestions: [
        'Show me budget phones under ₹20,000',
        'Compare top 3 headphones',
        'Best deals on shoes',
        'Recommend products for me',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeminiActive, setIsGeminiActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { behavior, addToCart, cart } = useBehavior();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();

    // Budget search
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('under') || lowerMessage.includes('affordable')) {
      const priceMatch = userMessage.match(/(\d+)/);
      const budget = priceMatch ? parseInt(priceMatch[1]) : 10000;

      const budgetProducts = products.filter(p => p.price <= budget).slice(0, 6);

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `I found ${budgetProducts.length} products under ₹${budget.toLocaleString()}. Here are the best value options:`,
        timestamp: Date.now(),
        products: budgetProducts,
      };
    }

    // Compare products
    if (lowerMessage.includes('compare')) {
      const category = lowerMessage.includes('phone') ? 'Mobiles' :
                      lowerMessage.includes('headphone') ? 'Headphones' :
                      lowerMessage.includes('watch') ? 'Watches' :
                      lowerMessage.includes('shoe') ? 'Shoes' : 'Mobiles';

      const compareProducts = products.filter(p => p.category === category).slice(0, 3);

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Here's a comparison of top ${category}:`,
        timestamp: Date.now(),
        products: compareProducts,
      };
    }

    // Deals and discounts
    if (lowerMessage.includes('deal') || lowerMessage.includes('discount') || lowerMessage.includes('offer')) {
      const dealsProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 6);

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `🔥 Here are the best deals right now with maximum discounts:`,
        timestamp: Date.now(),
        products: dealsProducts,
      };
    }

    // Recommendations based on behavior
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      // Get categories user has viewed most
      const viewedCategories = Object.keys(behavior.productViews)
        .map(id => products.find(p => p.id === id)?.category)
        .filter(Boolean);

      const topCategory = viewedCategories[0] || 'Mobiles';
      const recommended = products
        .filter(p => p.category === topCategory || p.trending || p.bestSeller)
        .slice(0, 6);

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Based on your browsing history, I recommend these products:`,
        timestamp: Date.now(),
        products: recommended,
      };
    }

    // Category search
    const categories = ['mobile', 'phone', 'headphone', 'watch', 'shoe', 'shirt', 'bag', 'grocery', 'accessories'];
    const foundCategory = categories.find(cat => lowerMessage.includes(cat));

    if (foundCategory) {
      const categoryMap: { [key: string]: string } = {
        mobile: 'Mobiles',
        phone: 'Mobiles',
        headphone: 'Headphones',
        watch: 'Watches',
        shoe: 'Shoes',
        shirt: 'Shirts',
        bag: 'Bags',
        grocery: 'Grocery',
        accessories: 'Accessories',
      };

      const category = categoryMap[foundCategory];
      const categoryProducts = products.filter(p => p.category === category).slice(0, 6);

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Here are our top ${category}:`,
        timestamp: Date.now(),
        products: categoryProducts,
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: "I can help you with:\n\n• Finding products in specific price ranges (e.g., 'phones under 30000')\n• Comparing products (e.g., 'compare headphones')\n• Getting best deals (e.g., 'show deals')\n• Personalized recommendations (e.g., 'recommend products')\n\nWhat would you like to explore?",
      timestamp: Date.now(),
      suggestions: [
        'Show budget options under ₹5000',
        'Compare watches',
        'Best deals today',
      ],
    };
  };

  const handleSend = async (messageText?: string) => {
    const rawText = messageText || input;
    const text = sanitizeInput(rawText);
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Get top viewed category for context
    const topViewedCategory = Object.keys(behavior.productViews)
      .map(id => products.find(p => p.id === id)?.category)
      .filter(Boolean)[0];

    // Try Gemini API first, fall back to local logic
    const geminiResult = await callGeminiAPI(text, {
      cartItemCount: cart.reduce((s, i) => s + i.quantity, 0),
      recentSearches: behavior.searchHistory.slice(0, 3),
      topViewedCategory,
    });

    setIsGeminiActive(geminiResult.fromGemini);

    if (geminiResult.fromGemini && geminiResult.text) {
      // Use real Gemini response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `✨ ${geminiResult.text}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      // Fall back to local rule-based response
      const aiResponse = generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">
            AI <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Assistant</span>
          </h1>
          {isGeminiActive && (
            <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
              <Zap className="h-3 w-3" /> Gemini Active
            </span>
          )}
        </div>
        <p className="text-gray-400">Your intelligent shopping companion powered by Google Gemini AI</p>
      </motion.div>

      {/* Chat Container */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
        {/* Messages */}
        <div className="h-[600px] overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}

                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl p-4 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ml-auto' 
                      : 'bg-white/10 border border-white/10'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSend(suggestion)}
                          className="border-white/20 hover:bg-white/10 text-sm"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Products */}
                  {message.products && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {message.products.map(product => (
                        <Card 
                          key={product.id} 
                          className="p-3 bg-white/5 border-white/10 hover:bg-white/10 transition-all group"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                          />
                          <p className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-orange-400 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-lg font-bold text-orange-400 mb-2">
                            ₹{product.price.toLocaleString()}
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through ml-2">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </p>
                          <Button 
                            size="sm" 
                            onClick={() => addToCart(product)}
                            className="w-full bg-orange-500 hover:bg-orange-600 h-8 text-xs"
                          >
                            Add to Cart
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="rounded-2xl p-4 bg-white/10 border border-white/10">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about products..."
              className="bg-white/5 border-white/10 flex-1"
            />
            <Button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSend('Show budget phones')}
              className="border-white/20 hover:bg-white/5 text-xs"
            >
              <Tag className="h-3 w-3 mr-1" />
              Budget Options
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSend('Best deals')}
              className="border-white/20 hover:bg-white/5 text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Best Deals
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSend('Recommend products')}
              className="border-white/20 hover:bg-white/5 text-xs"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Recommendations
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
