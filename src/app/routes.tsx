import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { ProductCatalog } from "./pages/ProductCatalog";
import { ShopperDashboard } from "./pages/ShopperDashboard";
import { SmartCart } from "./pages/SmartCart";
import { AIAssistant } from "./pages/AIAssistant";
import { RetailerAnalytics } from "./pages/RetailerAnalytics";
import { Settings } from "./pages/Settings";
import { Layout } from "./layouts/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "products", Component: ProductCatalog },
      { path: "dashboard", Component: ShopperDashboard },
      { path: "cart", Component: SmartCart },
      { path: "assistant", Component: AIAssistant },
      { path: "analytics", Component: RetailerAnalytics },
      { path: "settings", Component: Settings },
    ],
  },
]);
