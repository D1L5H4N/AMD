import { motion } from 'motion/react';
import { Eye, ShoppingCart, Search, TrendingUp, Clock, Heart, Tag, Sparkles } from 'lucide-react';
import { useBehavior } from '../contexts/BehaviorContext';
import { products } from '../data/products';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';

export function ShopperDashboard() {
  const { behavior, cart, addToCart } = useBehavior();

  // Analytics
  const totalViews = Object.values(behavior.productViews).reduce((sum, count) => sum + count, 0);
  const uniqueProducts = Object.keys(behavior.productViews).length;
  const cartValue = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Most viewed products
  const mostViewed = Object.entries(behavior.productViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([id]) => products.find(p => p.id === id))
    .filter(Boolean);

  // Recommendations based on viewed categories
  const viewedProducts = Object.keys(behavior.productViews)
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const viewedCategories = [...new Set(viewedProducts.map(p => p.category))];
  
  const recommendations = products
    .filter(p => 
      viewedCategories.includes(p.category) && 
      !behavior.productViews[p.id] &&
      (p.trending || p.bestSeller)
    )
    .slice(0, 6);

  // Recent searches
  const recentSearches = behavior.searchHistory.slice(0, 5);

  // Special offers based on behavior
  const offers = [
    { title: '10% Off First Purchase', code: 'FIRST20', color: 'from-blue-500 to-cyan-500' },
    { title: 'Save on Mobiles', code: 'SAVE10', color: 'from-green-500 to-emerald-500' },
    { title: 'Welcome Discount', code: 'WELCOME15', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Your <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="text-gray-400">Personalized insights and recommendations</p>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Eye, label: 'Products Viewed', value: totalViews, color: 'from-blue-500 to-cyan-500' },
          { icon: ShoppingCart, label: 'Items in Cart', value: cart.length, color: 'from-orange-500 to-red-500' },
          { icon: TrendingUp, label: 'Cart Value', value: `₹${cartValue.toLocaleString()}`, color: 'from-green-500 to-emerald-500' },
          { icon: Search, label: 'Searches', value: behavior.searchHistory.length, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Special Offers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">🎁 Exclusive Offers for You</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {offers.map((offer, index) => (
            <Card 
              key={offer.code}
              className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group cursor-pointer"
            >
              <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${offer.color} bg-opacity-10 mb-3`}>
                <Tag className="h-4 w-4 text-white mr-2" />
                <span className="text-sm font-medium">{offer.code}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                {offer.title}
              </h3>
              <p className="text-sm text-gray-400">Use code at checkout</p>
            </Card>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recently Viewed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">👀 Recently Viewed</h2>
            {mostViewed.length > 0 && (
              <Link to="/products">
                <Button variant="ghost" size="sm" className="text-orange-400">
                  View All
                </Button>
              </Link>
            )}
          </div>

          {mostViewed.length === 0 ? (
            <Card className="p-12 bg-white/5 border-white/10 text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Start browsing to see products here</p>
              <Link to="/products">
                <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                  Browse Products
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {mostViewed.map(product => product && (
                <Card 
                  key={product.id} 
                  className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
                >
                  <div className="flex gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-orange-400 transition-colors">
                          {product.name}
                        </h3>
                        <Badge variant="outline" className="flex-shrink-0 border-white/20">
                          {behavior.productViews[product.id]}x
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-400">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">✨ AI Recommendations</h2>
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>

          {recommendations.length === 0 ? (
            <Card className="p-12 bg-white/5 border-white/10 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Browse products to get personalized recommendations</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recommendations.map(product => (
                <Card 
                  key={product.id} 
                  className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
                >
                  <div className="flex gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-semibold line-clamp-1 flex-1 group-hover:text-orange-400 transition-colors">
                          {product.name}
                        </h3>
                        {product.trending && (
                          <Badge className="bg-orange-500 text-white border-0 flex-shrink-0">
                            Trending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-400">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold mb-4">
          <Clock className="inline h-6 w-6 mr-2" />
          Recent Activity
        </h2>
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <div className="space-y-3">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Recent Searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge key={index} variant="outline" className="border-white/20">
                      <Search className="h-3 w-3 mr-1" />
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Compared Products */}
            {behavior.comparedProducts.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-2">Products in Comparison:</p>
                <div className="flex flex-wrap gap-2">
                  {behavior.comparedProducts.map(id => {
                    const product = products.find(p => p.id === id);
                    return product && (
                      <Badge key={id} variant="outline" className="border-orange-500/30">
                        {product.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {recentSearches.length === 0 && behavior.comparedProducts.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No recent activity. Start shopping to see your history here!
              </p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Shopping Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
          <div className="flex items-start gap-4">
            <Sparkles className="h-8 w-8 text-orange-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">💡 AI Shopping Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Products you view 3+ times get special trust badges and reviews</li>
                <li>• Remove items from cart to receive instant discount coupons</li>
                <li>• Search with "budget" or "under ₹" to find best value options</li>
                <li>• Add 3+ products to comparison for side-by-side analysis</li>
                <li>• Cart reminders activate after 30 seconds of inactivity</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
