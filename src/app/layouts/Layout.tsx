import { Outlet, Link, useLocation } from 'react-router';
import { ShoppingCart, Brain, LayoutDashboard, BarChart3, Settings, Sparkles, Menu, X } from 'lucide-react';
import { BehaviorProvider, useBehavior } from '../contexts/BehaviorContext';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function LayoutContent() {
  const location = useLocation();
  const { cart } = useBehavior();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add dark class to html element
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/products', label: 'Products', icon: ShoppingCart },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assistant', label: 'AI Assistant', icon: Brain },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 blur-lg opacity-50" />
                <div className="relative rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-2">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                NeuroCart AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'text-orange-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Link to="/cart">
                <Button variant="outline" size="sm" className="relative border-orange-500/30 hover:border-orange-500">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(path)
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 NeuroCart AI. Powered by Gemini & Firebase.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>🏆 Built for Hackathon Excellence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Layout() {
  return (
    <BehaviorProvider>
      <LayoutContent />
    </BehaviorProvider>
  );
}