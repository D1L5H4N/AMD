import { motion } from 'motion/react';
import { X, Star, Check, Minus } from 'lucide-react';
import { Product } from '../data/products';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductComparison({ products, onClose, onAddToCart }: ProductComparisonProps) {
  if (products.length === 0) return null;

  const features = Array.from(
    new Set(products.flatMap(p => p.features))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl max-h-[90vh] overflow-auto"
      >
        <Card className="bg-[#0a0a0a] border-white/20 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Product <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Comparison</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                  {products.map(product => (
                    <th key={product.id} className="p-4 min-w-[200px]">
                      <div className="text-center">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                        />
                        <p className="font-semibold mb-1">{product.name}</p>
                        <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                        <p className="text-2xl font-bold text-orange-400 mb-2">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <Button 
                          size="sm"
                          onClick={() => onAddToCart(product)}
                          className="bg-orange-500 hover:bg-orange-600 w-full"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Rating */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 text-gray-400">Rating</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Price Comparison */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 text-gray-400">Discount</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      {product.originalPrice ? (
                        <div>
                          <p className="text-green-400 font-medium">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Stock */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 text-gray-400">Stock</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      <span className={product.stock > 10 ? 'text-green-400' : 'text-yellow-400'}>
                        {product.stock} units
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                {features.map(feature => (
                  <tr key={feature} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4 text-gray-400">{feature}</td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        {product.features.includes(feature) ? (
                          <Check className="h-5 w-5 text-green-400 mx-auto" />
                        ) : (
                          <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Badges */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 text-gray-400">Status</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {product.trending && (
                          <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400 text-xs">
                            Trending
                          </span>
                        )}
                        {product.bestSeller && (
                          <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs">
                            Best Seller
                          </span>
                        )}
                        {!product.trending && !product.bestSeller && (
                          <Minus className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                ✨ AI-powered comparison to help you make the best choice
              </p>
              <Button variant="outline" onClick={onClose} className="border-white/20">
                Close Comparison
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
