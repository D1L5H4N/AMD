import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, TrendingUp, Award, ShoppingCart, Eye, GitCompare } from 'lucide-react';
import { products, categories, Product } from '../data/products';
import { useBehavior } from '../contexts/BehaviorContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  
  const { addToCart, trackProductView, trackSearch, addToComparison, behavior } = useBehavior();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      trackSearch(query);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Product <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Catalog</span>
        </h1>
        <p className="text-gray-400">Browse our curated collection with AI-powered recommendations</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search products... (try 'budget phone' or 'under 5000')"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 h-12"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 border-0' 
                : 'border-white/20 hover:bg-white/5'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <span className="text-sm text-gray-400">
            {filteredProducts.length} products found
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index}
            onView={trackProductView}
            onAddToCart={addToCart}
            onCompare={addToComparison}
            viewCount={behavior.productViews[product.id] || 0}
            isComparing={behavior.comparedProducts.includes(product.id)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  onView: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onCompare: (id: string) => void;
  viewCount: number;
  isComparing: boolean;
}

function ProductCard({ product, index, onView, onAddToCart, onCompare, viewCount, isComparing }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleView = () => {
    onView(product.id);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => {
        setIsHovered(true);
        handleView();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-white/5">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.trending && (
              <Badge className="bg-orange-500 text-white border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
            {product.bestSeller && (
              <Badge className="bg-purple-500 text-white border-0">
                <Award className="h-3 w-3 mr-1" />
                Best Seller
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-green-500 text-white border-0">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* View Count Badge - Shows after 2+ views */}
          {viewCount >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2"
            >
              <Badge className="bg-blue-500/90 text-white border-0">
                <Eye className="h-3 w-3 mr-1" />
                Viewed {viewCount}x
              </Badge>
            </motion.div>
          )}

          {/* Compare Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            onClick={() => onCompare(product.id)}
            className={`absolute bottom-2 right-2 p-2 rounded-lg ${
              isComparing 
                ? 'bg-orange-500 text-white' 
                : 'bg-black/50 text-white hover:bg-black/70'
            } backdrop-blur-sm transition-colors`}
          >
            <GitCompare className="h-4 w-4" />
          </motion.button>

          {/* Stock Warning */}
          {product.stock < 10 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="destructive">
                Only {product.stock} left!
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">{product.category}</p>
            <h3 className="font-semibold line-clamp-2 group-hover:text-orange-400 transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-400">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 2).map(feature => (
              <Badge key={feature} variant="outline" className="text-xs border-white/20">
                {feature}
              </Badge>
            ))}
          </div>

          {/* Add to Cart */}
          <Button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
