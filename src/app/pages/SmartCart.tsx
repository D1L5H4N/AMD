import { motion } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, Tag, Sparkles, TrendingDown, PackageCheck } from 'lucide-react';
import { useBehavior } from '../contexts/BehaviorContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { products } from '../data/products';
import { Link } from 'react-router';
import { useState } from 'react';

export function SmartCart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, appliedCoupon, applyCoupon, removeCoupon, behavior } = useBehavior();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (couponInput) {
      applyCoupon(couponInput.toUpperCase());
      setCouponInput('');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = subtotal - cartTotal;
  const shipping = cartTotal > 1000 ? 0 : 99;
  const total = cartTotal + shipping;

  // AI: Find cheaper alternatives for cart items
  const findAlternatives = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return [];

    return products.filter(p => 
      p.category === product.category &&
      p.id !== productId &&
      p.price < product.price
    ).slice(0, 2);
  };

  // Check if any items were recently removed
  const recentlyRemoved = behavior.cartHistory
    .filter(h => h.action === 'remove')
    .slice(-3);

  const removedProducts = recentlyRemoved
    .map(h => products.find(p => p.id === h.productId))
    .filter(Boolean);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg mx-auto"
        >
          <div className="mb-6">
            <div className="inline-flex p-6 rounded-full bg-white/5 border border-white/10">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">
            Discover amazing products and start shopping with AI-powered recommendations
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0">
              <Sparkles className="mr-2 h-5 w-5" />
              Browse Products
            </Button>
          </Link>

          {/* Show recently removed items */}
          {removedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Recently Removed Items</h3>
              <div className="space-y-3">
                {removedProducts.map(product => product && (
                  <Card key={product.id} className="p-4 bg-white/5 border-white/10">
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-orange-400 font-semibold">₹{product.price.toLocaleString()}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => {
                          // Would add back to cart
                        }}
                      >
                        Add Back
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Smart <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Cart</span>
        </h1>
        <p className="text-gray-400">AI-powered suggestions to save you money</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const alternatives = findAlternatives(item.product.id);
            const hasDiscount = item.product.originalPrice && item.product.originalPrice > item.product.price;

            return (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      {hasDiscount && (
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                          SALE
                        </Badge>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold mb-1">{item.product.name}</h3>
                          <p className="text-sm text-gray-400">{item.product.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 border-white/20"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 border-white/20"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          {item.product.originalPrice && (
                            <p className="text-sm text-gray-400 line-through">
                              ₹{(item.product.originalPrice * item.quantity).toLocaleString()}
                            </p>
                          )}
                          <p className="text-xl font-bold text-orange-400">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Stock warning */}
                      {item.product.stock < 10 && (
                        <p className="text-sm text-yellow-400 mt-2">
                          ⚠️ Only {item.product.stock} left in stock
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AI Alternatives */}
                  {alternatives.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">AI Suggestion: Save Money</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {alternatives.map(alt => (
                          <div key={alt.id} className="p-3 rounded-lg bg-white/5 border border-green-500/30">
                            <p className="text-sm font-medium mb-1 line-clamp-1">{alt.name}</p>
                            <p className="text-lg font-bold text-green-400 mb-2">
                              ₹{alt.price.toLocaleString()}
                              <span className="text-xs ml-1">
                                (Save ₹{(item.product.price - alt.price).toLocaleString()})
                              </span>
                            </p>
                            <Button size="sm" variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">
                              View Alternative
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {/* Coupon */}
              <div className="space-y-3">
                <label className="text-sm text-gray-400">Apply Coupon</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">{appliedCoupon}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-white"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="bg-white/5 border-white/10"
                    />
                    <Button 
                      onClick={handleApplyCoupon}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Available codes:</p>
                  <div className="flex flex-wrap gap-2">
                    {['SAVE10', 'WELCOME15', 'FIRST20'].map(code => (
                      <Badge
                        key={code}
                        variant="outline"
                        className="cursor-pointer border-orange-500/30 hover:bg-orange-500/10"
                        onClick={() => {
                          setCouponInput(code);
                          applyCoupon(code);
                        }}
                      >
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount</span>
                    <span className="font-medium text-green-400">-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    💡 Add ₹{(1000 - cartTotal).toFixed(0)} more for free shipping!
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-orange-400">₹{total.toFixed(0)}</span>
              </div>

              {/* Checkout */}
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0 h-12">
                <PackageCheck className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span>Fast delivery available</span>
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="mt-4 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">AI Shopping Tip</p>
                  <p className="text-xs text-gray-400">
                    {discount > 0 
                      ? `You're saving ₹${discount.toFixed(0)} with current deals!`
                      : 'Check out our alternatives to save more on similar products.'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
