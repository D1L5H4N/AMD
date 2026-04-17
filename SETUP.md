# NeuroCart AI - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
- Node.js 18 or higher
- npm or pnpm package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Installation

```bash
# Clone or download the project
cd neurocart-ai

# Install dependencies
npm install
# or if using pnpm
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

The app will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
# or
pnpm build
```

## ✅ Verification - Test the AI Features

### Test 1: Trust Badge Trigger (30 seconds)
1. Go to **Products** page
2. Hover over any product 4 times (each hover counts as a view)
3. ✅ Success: You'll see a toast notification saying "🔒 Verified Product"

### Test 2: Cart Abandonment Recovery (30 seconds)
1. Add any product to cart
2. Go to **Cart** page
3. Click the trash icon to remove the product
4. ✅ Success: AI shows a coupon offer notification

### Test 3: Budget Shopping (15 seconds)
1. Go to **Products** page
2. Search: "budget phone" or "under 20000"
3. ✅ Success: AI shows "💰 Budget Options" notification

### Test 4: Cart Inactivity (30 seconds)
1. Add any product to cart
2. Go to **Cart** page
3. Wait 30 seconds without clicking anything
4. ✅ Success: Cart reminder notification appears

### Test 5: AI Assistant (30 seconds)
1. Go to **AI Assistant** page
2. Type: "Show me best deals"
3. Click send or press Enter
4. ✅ Success: AI responds with product recommendations

### Test 6: Analytics Dashboard (15 seconds)
1. After browsing products and using features
2. Go to **Analytics** page
3. ✅ Success: See charts showing your activity

## 🎯 Navigation

- **Home (/)** - Landing page with features and testimonials
- **Products (/products)** - Browse catalog with AI triggers
- **Dashboard (/dashboard)** - Your personalized shopping insights
- **Cart (/cart)** - Smart cart with AI alternatives
- **AI Assistant (/assistant)** - Chat with AI shopping helper
- **Analytics (/analytics)** - Retailer analytics dashboard
- **Settings (/settings)** - Language, notifications, privacy

## 🔧 Optional Configuration

### Firebase (Optional - Works without it)
1. Create Firebase project at https://console.firebase.google.com/
2. Copy `.env.example` to `.env`
3. Add your Firebase config values
4. Restart dev server

### Gemini AI (Optional - Works without it)
1. Get API key from https://makersuite.google.com/app/apikey
2. Add to `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Restart dev server

**Note:** The demo uses localStorage and simulated AI responses, so it works perfectly without any external APIs!

## 📱 Mobile Testing

The app is fully responsive. Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Use browser DevTools to toggle device emulation.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear build cache
rm -rf dist
npm run build
```

### Dark Theme Not Showing
- The app automatically applies dark theme
- Check browser console for errors
- Clear browser cache and reload

## 📊 Expected Behavior

### AI Triggers
- **3+ product views** → Trust badge notification
- **Cart item removal** → 10% coupon offer
- **"Budget" search** → Best value products
- **30s cart inactivity** → Recovery reminder
- **3+ comparisons** → Comparison table suggestion

### Data Persistence
- Cart items saved in localStorage
- Behavior tracking persists across sessions
- Settings saved locally

### Performance
- Initial load: < 2 seconds
- Page transitions: Smooth animations
- Mobile responsive: All breakpoints

## 🎨 Customization

### Change Primary Color
Edit `/src/app/layouts/Layout.tsx` and components:
- Replace `orange-500` with your brand color
- Update gradient classes

### Add Products
Edit `/src/app/data/products.ts`:
```typescript
{
  id: "unique-id",
  name: "Product Name",
  category: "Category",
  price: 9999,
  // ... other fields
}
```

### Modify AI Triggers
Edit `/src/app/contexts/BehaviorContext.tsx`:
- Adjust trigger thresholds
- Add new behavioral patterns
- Customize notification messages

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## 📞 Support

- **GitHub Issues:** Report bugs or request features
- **Documentation:** See README.md for full details
- **Demo:** All features work in demo mode

## 🎉 You're Ready!

NeuroCart AI is now running. Start exploring the AI-powered features and test the intelligent triggers!

**Pro Tip:** Open browser DevTools Console to see AI trigger logs in action.
