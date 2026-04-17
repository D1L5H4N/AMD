import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product } from '../data/products';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

interface BehaviorData {
  productViews: { [productId: string]: number };
  lastViewTime: { [productId: string]: number };
  cartHistory: { productId: string; action: 'add' | 'remove'; timestamp: number }[];
  searchHistory: string[];
  comparedProducts: string[];
  cartInactivityStart: number | null;
  language: 'en' | 'hi' | 'ta';
}

interface BehaviorContextType {
  cart: CartItem[];
  behavior: BehaviorData;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  trackProductView: (productId: string) => void;
  trackSearch: (query: string) => void;
  addToComparison: (productId: string) => void;
  clearComparison: () => void;
  setLanguage: (lang: 'en' | 'hi' | 'ta') => void;
  resetBehavior: () => void;
  cartTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

const BehaviorContext = createContext<BehaviorContextType | undefined>(undefined);

const initialBehavior: BehaviorData = {
  productViews: {},
  lastViewTime: {},
  cartHistory: [],
  searchHistory: [],
  comparedProducts: [],
  cartInactivityStart: null,
  language: 'en',
};

export function BehaviorProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('neurocart-cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      // Corrupted storage — reset safely
      localStorage.removeItem('neurocart-cart');
      return [];
    }
  });

  const [behavior, setBehavior] = useState<BehaviorData>(() => {
    try {
      const saved = localStorage.getItem('neurocart-behavior');
      return saved ? (JSON.parse(saved) as BehaviorData) : initialBehavior;
    } catch {
      // Corrupted storage — reset safely
      localStorage.removeItem('neurocart-behavior');
      return initialBehavior;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Persist cart and behavior
  useEffect(() => {
    localStorage.setItem('neurocart-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('neurocart-behavior', JSON.stringify(behavior));
  }, [behavior]);

  // Track cart inactivity
  useEffect(() => {
    if (cart.length > 0 && !behavior.cartInactivityStart) {
      setBehavior(prev => ({ ...prev, cartInactivityStart: Date.now() }));
    } else if (cart.length === 0) {
      setBehavior(prev => ({ ...prev, cartInactivityStart: null }));
    }
  }, [cart.length]);

  // Show recovery popup after 30 seconds of inactivity
  useEffect(() => {
    if (!behavior.cartInactivityStart || cart.length === 0) return;

    const timer = setTimeout(() => {
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      toast.info('🛒 Cart Reminder', {
        description: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} waiting! Complete your purchase now.`,
        duration: 8000,
      });
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [behavior.cartInactivityStart, cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, addedAt: Date.now() }];
    });

    setBehavior(prev => ({
      ...prev,
      cartHistory: [...prev.cartHistory, { productId: product.id, action: 'add', timestamp: Date.now() }],
      cartInactivityStart: Date.now(),
    }));

    toast.success('Added to cart!', {
      description: product.name,
    });
  };

  const removeFromCart = (productId: string) => {
    const removedItem = cart.find(item => item.product.id === productId);
    
    setCart(prev => prev.filter(item => item.product.id !== productId));

    if (removedItem) {
      setBehavior(prev => ({
        ...prev,
        cartHistory: [...prev.cartHistory, { productId, action: 'remove', timestamp: Date.now() }],
      }));

      // AI Trigger: Show coupon when item removed
      setTimeout(() => {
        toast.info('💡 AI Suggestion', {
          description: `Get 10% off on ${removedItem.product.name} with code SAVE10`,
          duration: 10000,
          action: {
            label: 'Apply Coupon',
            onClick: () => applyCoupon('SAVE10'),
          },
        });
      }, 1000);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const trackProductView = (productId: string) => {
    setBehavior(prev => {
      const newViews = (prev.productViews[productId] || 0) + 1;
      const updated = {
        ...prev,
        productViews: { ...prev.productViews, [productId]: newViews },
        lastViewTime: { ...prev.lastViewTime, [productId]: Date.now() },
      };

      // AI Trigger: Show trust badge after 3 views
      if (newViews === 3) {
        setTimeout(() => {
          toast.success('🔒 Verified Product', {
            description: 'This product has excellent reviews and 30-day return policy!',
            duration: 8000,
          });
        }, 500);
      }

      return updated;
    });
  };

  const trackSearch = (query: string) => {
    setBehavior(prev => ({
      ...prev,
      searchHistory: [query, ...prev.searchHistory.filter(q => q !== query)].slice(0, 10),
    }));

    // AI Trigger: Detect price-sensitive searches
    const priceKeywords = ['cheap', 'budget', 'under', 'affordable', 'low price', 'discount'];
    const isPriceSensitive = priceKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );

    if (isPriceSensitive) {
      setTimeout(() => {
        toast.info('💰 Budget Options', {
          description: 'We found best-value products matching your search!',
          duration: 6000,
        });
      }, 500);
    }
  };

  const addToComparison = (productId: string) => {
    setBehavior(prev => {
      const newComparison = prev.comparedProducts.includes(productId)
        ? prev.comparedProducts
        : [...prev.comparedProducts, productId];

      // AI Trigger: Show comparison table when 3+ products compared
      if (newComparison.length >= 3 && newComparison.length > prev.comparedProducts.length) {
        setTimeout(() => {
          toast.info('📊 Comparison Ready', {
            description: 'View side-by-side comparison of selected products',
            duration: 8000,
          });
        }, 500);
      }

      return { ...prev, comparedProducts: newComparison };
    });
  };

  const clearComparison = () => {
    setBehavior(prev => ({ ...prev, comparedProducts: [] }));
  };

  const setLanguage = (lang: 'en' | 'hi' | 'ta') => {
    setBehavior(prev => ({ ...prev, language: lang }));
    const langNames = { en: 'English', hi: 'हिन्दी', ta: 'தமிழ்' };
    toast.success(`Language changed to ${langNames[lang]}`);
  };

  const resetBehavior = () => {
    setBehavior(initialBehavior);
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('neurocart-cart');
    localStorage.removeItem('neurocart-behavior');
    toast.success('All data cleared');
  };

  const applyCoupon = (code: string) => {
    setAppliedCoupon(code);
    toast.success('Coupon applied!', {
      description: `Code: ${code}`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  /** Memoised cart total — only recalculates when cart items or coupon change */
  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (appliedCoupon === 'SAVE10') return subtotal * 0.9;
    if (appliedCoupon === 'WELCOME15') return subtotal * 0.85;
    if (appliedCoupon === 'FIRST20') return subtotal * 0.8;
    return subtotal;
  }, [cart, appliedCoupon]);

  return (
    <BehaviorContext.Provider
      value={{
        cart,
        behavior,
        addToCart,
        removeFromCart,
        updateQuantity,
        trackProductView,
        trackSearch,
        addToComparison,
        clearComparison,
        setLanguage,
        resetBehavior,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </BehaviorContext.Provider>
  );
}

export function useBehavior() {
  const context = useContext(BehaviorContext);
  if (!context) {
    throw new Error('useBehavior must be used within BehaviorProvider');
  }
  return context;
}
