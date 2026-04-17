import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Eye, 
  BarChart3,
  Brain,
  Target,
  Zap
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useBehavior } from '../contexts/BehaviorContext';
import { products } from '../data/products';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function RetailerAnalytics() {
  const { behavior, cart } = useBehavior();

  // Mock analytics data (in real app, this would come from backend)
  const stats = {
    cartsRecovered: 47,
    conversionRate: 23.4,
    revenueUplift: 3.2,
    totalRevenue: 1247890,
    activeSessions: 156,
    avgOrderValue: 8450,
  };

  // Revenue trend data
  const revenueTrend = [
    { month: 'Jan', revenue: 320000, recovered: 45000 },
    { month: 'Feb', revenue: 420000, recovered: 62000 },
    { month: 'Mar', revenue: 580000, recovered: 98000 },
    { month: 'Apr', revenue: 750000, recovered: 145000 },
  ];

  // Top viewed products
  const topViewedData = Object.entries(behavior.productViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id, views]) => {
      const product = products.find(p => p.id === id);
      return {
        name: product?.name.split(' ').slice(0, 3).join(' ') || 'Unknown',
        views,
        category: product?.category || 'Other',
      };
    });

  // Category distribution
  const categoryData = products.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);

  // Conversion funnel
  const funnelData = [
    { stage: 'Visitors', count: 1250, percentage: 100 },
    { stage: 'Product Views', count: 890, percentage: 71 },
    { stage: 'Add to Cart', count: 420, percentage: 34 },
    { stage: 'Checkout', count: 280, percentage: 22 },
    { stage: 'Purchase', count: 195, percentage: 16 },
  ];

  const COLORS = ['#ff6b35', '#f7931e', '#fdc500', '#a6ce39', '#00b9ae', '#00aeef', '#7ac943', '#ec008c'];

  // AI Insights
  const aiInsights = [
    {
      title: 'Peak Hesitation Product',
      description: 'Samsung Galaxy S24 Ultra has highest view-to-cart drop rate',
      metric: '67%',
      trend: 'down',
      action: 'Suggest price reduction or bundle offer',
    },
    {
      title: 'Budget Search Spike',
      description: '34% increase in "under ₹" searches this week',
      metric: '+34%',
      trend: 'up',
      action: 'Promote budget-friendly product collection',
    },
    {
      title: 'Cart Recovery Success',
      description: 'AI coupons recovering 47% of abandoned carts',
      metric: '47%',
      trend: 'up',
      action: 'Expand coupon trigger scenarios',
    },
    {
      title: 'Comparison Behavior',
      description: 'Headphones category sees most product comparisons',
      metric: '156',
      trend: 'neutral',
      action: 'Create comparison guides for this category',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Retailer <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Analytics</span>
        </h1>
        <p className="text-gray-400">Real-time insights powered by NeuroCart AI</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { 
            icon: ShoppingCart, 
            label: 'Carts Recovered', 
            value: stats.cartsRecovered, 
            suffix: '%',
            color: 'from-green-500 to-emerald-500',
            change: '+12%'
          },
          { 
            icon: TrendingUp, 
            label: 'Conversion Rate', 
            value: stats.conversionRate, 
            suffix: '%',
            color: 'from-blue-500 to-cyan-500',
            change: '+5.2%'
          },
          { 
            icon: Target, 
            label: 'Revenue Uplift', 
            value: stats.revenueUplift, 
            suffix: 'x',
            color: 'from-orange-500 to-red-500',
            change: '+18%'
          },
          { 
            icon: DollarSign, 
            label: 'Total Revenue', 
            value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
            color: 'from-purple-500 to-pink-500',
            change: '+24%'
          },
          { 
            icon: Users, 
            label: 'Active Sessions', 
            value: stats.activeSessions,
            color: 'from-yellow-500 to-orange-500',
            change: '+8%'
          },
          { 
            icon: BarChart3, 
            label: 'Avg Order Value', 
            value: `₹${(stats.avgOrderValue / 1000).toFixed(1)}K`,
            color: 'from-indigo-500 to-purple-500',
            change: '+15%'
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} bg-opacity-10`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
                {metric.change && (
                  <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                    {metric.change}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold mb-1">
                {metric.value}{metric.suffix}
              </p>
              <p className="text-xs text-gray-400">{metric.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">Revenue Trend & Recovery</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2} name="Total Revenue" />
                <Line type="monotone" dataKey="recovered" stroke="#00b9ae" strokeWidth={2} name="AI Recovered" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Top Viewed Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">
              <Eye className="inline h-5 w-5 mr-2" />
              Top Viewed Products
            </h2>
            {topViewedData.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No product views yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topViewedData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#888" />
                  <YAxis dataKey="name" type="category" stroke="#888" width={150} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Bar dataKey="views" fill="#ff6b35" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">Conversion Funnel</h2>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-gray-400">{stage.count} ({stage.percentage}%)</span>
                  </div>
                  <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold"
                      style={{ minWidth: stage.percentage > 10 ? 'auto' : '40px' }}
                    >
                      {stage.percentage}%
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-6 w-6 text-orange-400" />
          <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{insight.title}</h3>
                  <Badge className={`${
                    insight.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                    insight.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  } border-0`}>
                    {insight.metric}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-3">{insight.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-medium">Action:</span>
                  <span className="text-gray-300">{insight.action}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Card className="p-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">NeuroCart AI Impact Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold text-orange-400 mb-1">₹4.2M</p>
                  <p className="text-sm text-gray-400">Total Revenue Recovered This Quarter</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-400 mb-1">2,847</p>
                  <p className="text-sm text-gray-400">Abandoned Carts Recovered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-400 mb-1">89%</p>
                  <p className="text-sm text-gray-400">Customer Satisfaction Score</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
