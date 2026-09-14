import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { applySeo } from "@/lib/seo";
import NotFound from "@/pages/NotFound";
import { legacyRedirects } from "@shared/seo";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EquipmentPage, GuidePage, Guides } from "./pages/ContentPages";
import Home from "./pages/Home";
import { Contact, ProductDetail, Support } from "./pages/Pages";
import Products from "./pages/Products";
import { SectorDetail, Sectors } from "./pages/Sectors";

function RouteEffects() {
  const [location, navigate] = useLocation();

  // The legacy site routed products as index.html#product/<id>; fragments never reach the server, so redirect here.
  useEffect(() => {
    const legacyProduct = window.location.hash.match(/^#product\/([\w-]+)/);
    if (legacyProduct) navigate(`/products/${legacyProduct[1]}`, { replace: true });
  }, [navigate]);

  useEffect(() => {
    const target = legacyRedirects[location];
    if (target) {
      navigate(target, { replace: true });
      return;
    }
    applySeo(location);
    window.scrollTo(0, 0);
  }, [location, navigate]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/equipment/:slug" component={EquipmentPage} />
      <Route path="/sectors" component={Sectors} />
      <Route path="/sectors/:slug" component={SectorDetail} />
      <Route path="/guides" component={Guides} />
      <Route path="/guides/:slug" component={GuidePage} />
      <Route path="/support" component={Support} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <RouteEffects />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
