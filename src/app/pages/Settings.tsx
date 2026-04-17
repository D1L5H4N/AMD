import { motion } from 'motion/react';
import { Settings as SettingsIcon, Globe, Bell, Trash2, Database, Download, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useBehavior } from '../contexts/BehaviorContext';
import { useState } from 'react';
import { toast } from 'sonner';

export function Settings() {
  const { behavior, setLanguage, resetBehavior } = useBehavior();
  const [notifications, setNotifications] = useState({
    cartReminders: true,
    priceDrops: true,
    newDeals: true,
    aiSuggestions: true,
  });

  const handleLanguageChange = (lang: 'en' | 'hi' | 'ta') => {
    setLanguage(lang);
  };

  const handleExportData = () => {
    const data = {
      behavior,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurocart-data-${Date.now()}.json`;
    a.click();
    toast.success('Data exported successfully');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      resetBehavior();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-gray-400">Customize your NeuroCart AI experience</p>
      </motion.div>

      <div className="space-y-6">
        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 bg-opacity-10">
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">Language Preferences</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Choose your preferred language for the shopping experience
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en', name: 'English', native: 'English' },
                { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
                { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
              ].map((lang) => (
                <Button
                  key={lang.code}
                  variant={behavior.language === lang.code ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange(lang.code as 'en' | 'hi' | 'ta')}
                  className={behavior.language === lang.code 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 border-0' 
                    : 'border-white/20 hover:bg-white/5'
                  }
                >
                  <div className="text-center w-full">
                    <div className="font-semibold">{lang.name}</div>
                    <div className="text-xs opacity-80">{lang.native}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-10">
                <Bell className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Manage your AI-powered notification preferences
            </p>
            <div className="space-y-4">
              {[
                { 
                  key: 'cartReminders', 
                  label: 'Cart Reminders', 
                  description: 'Get notified about items in your cart after inactivity' 
                },
                { 
                  key: 'priceDrops', 
                  label: 'Price Drop Alerts', 
                  description: 'Receive alerts when viewed products go on sale' 
                },
                { 
                  key: 'newDeals', 
                  label: 'New Deals & Offers', 
                  description: 'Stay updated with latest discounts and promotions' 
                },
                { 
                  key: 'aiSuggestions', 
                  label: 'AI Suggestions', 
                  description: 'Get smart product recommendations and alternatives' 
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium mb-1">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, [item.key]: checked }));
                      toast.success(`${item.label} ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Privacy & Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 bg-opacity-10">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold">Privacy & Data</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Manage your shopping data and privacy settings
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">Data Collection</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      NeuroCart AI collects browsing behavior, search history, and cart activity to provide personalized recommendations and improve your shopping experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="border-white/20 hover:bg-white/5"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearData}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Account Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Your Activity Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-orange-400">
                  {Object.values(behavior.productViews).reduce((sum, count) => sum + count, 0)}
                </p>
                <p className="text-sm text-gray-400 mt-1">Total Views</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-orange-400">
                  {Object.keys(behavior.productViews).length}
                </p>
                <p className="text-sm text-gray-400 mt-1">Products Viewed</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-orange-400">
                  {behavior.searchHistory.length}
                </p>
                <p className="text-sm text-gray-400 mt-1">Searches Made</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-orange-400">
                  {behavior.comparedProducts.length}
                </p>
                <p className="text-sm text-gray-400 mt-1">Products Compared</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
            <div className="flex items-start gap-4">
              <SettingsIcon className="h-8 w-8 text-orange-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-3">How NeuroCart AI Uses Your Data</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Tracks product views to show trust badges after 3+ views</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Detects cart removals and triggers instant discount coupons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Analyzes search keywords to identify price-sensitive shoppers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Monitors cart inactivity and sends recovery reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Suggests cheaper alternatives when viewing expensive products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Creates comparison tables when 3+ products are compared</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
