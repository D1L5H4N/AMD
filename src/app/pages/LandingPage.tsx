import { motion } from 'motion/react';
import { Link } from 'react-router';
import { 
  Brain, 
  ShoppingCart, 
  TrendingUp, 
  Zap, 
  Shield, 
  BarChart3, 
  MessageSquare,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useEffect, useState } from 'react';

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { value: '47%', label: 'Cart Recovery Rate' },
    { value: '3.2x', label: 'Revenue Uplift' },
    { value: '89%', label: 'Conversion Boost' },
    { value: '₹12M+', label: 'Revenue Saved' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Behavior Analysis',
      description: 'Real-time tracking of user intent, hesitation patterns, and purchase signals',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Zap,
      title: 'Smart Triggers',
      description: 'Automatic coupons, alternatives, and recovery prompts based on user actions',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Natural language shopping help, product comparisons, and personalized recommendations',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Precision Personalization',
      description: 'Multilingual support, price-sensitive detection, and category preference learning',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Retailer Analytics',
      description: 'Comprehensive dashboard showing recovery rates, revenue impact, and AI insights',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Trust Building',
      description: 'Automated trust badges, review highlights, and urgency notifications',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'E-commerce Director, Fashion Bazaar',
      content: 'NeuroCart AI increased our conversion rate by 67% in just 3 weeks. The AI triggers are incredibly accurate.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Founder, TechMart India',
      content: 'We recovered ₹4.2M in abandoned carts last month. This is a game-changer for online retail.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      role: 'CEO, GroceryHub',
      content: 'The multilingual support and price-sensitivity detection helped us serve diverse customers better.',
      rating: 5,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.1),transparent_50%)]" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,107,53,0.05), transparent 40%)`,
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-orange-400 font-medium">AI-Powered Conversion Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Stop Losing Sales to
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Cart Abandonment
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            NeuroCart AI analyzes shopping behavior in real-time and deploys intelligent triggers 
            to recover abandoned carts, boost conversions, and maximize revenue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-500/50">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/analytics">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Intelligent Features That
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"> Drive Results</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powered by Google Gemini AI and real-time behavioral analytics
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-10`}>
                    <feature.icon className={`h-6 w-6 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How NeuroCart AI <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Works</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { step: '01', title: 'Observe', description: 'Track user behavior: product views, cart actions, search patterns, and hesitation signals' },
            { step: '02', title: 'Analyze', description: 'AI processes behavioral data to understand intent, budget sensitivity, and purchase readiness' },
            { step: '03', title: 'Trigger', description: 'Deploy smart interventions: coupons, alternatives, comparisons, trust badges, and reminders' },
            { step: '04', title: 'Convert', description: 'Recover abandoned carts, increase conversion rates, and maximize customer lifetime value' },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Leading Retailers</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-orange-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to 10x Your Conversions?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of retailers using NeuroCart AI to recover lost revenue
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Experience the Demo
                </Button>
              </Link>
              <Link to="/assistant">
                <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10">
                  <Brain className="mr-2 h-5 w-5" />
                  Talk to AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
