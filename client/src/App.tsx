import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { applySeo } from "@/lib/seo";
import NotFound from "@/pages/NotFound";
import { legacyRedirects } from "@shared/seo";
import { useEffect, useState, type ReactNode } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EquipmentPage, GuidePage, Guides } from "./pages/ContentPages";
import Home from "./pages/Home";
import CRM from "./pages/CRM";
import Login from "./pages/Login";
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

// The lead desk checks the session with the server rather than trusting anything in the browser.
function PrivateRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "anonymous">("loading");
  useEffect(() => {
    fetch("/api/auth/session").then((response) => setStatus(response.ok ? "authenticated" : "anonymous")).catch(() => setStatus("anonymous"));
  }, []);
  useEffect(() => {
    if (status === "anonymous") window.location.replace("/login");
  }, [status]);
  if (status !== "authenticated") return <div className="min-h-screen bg-[#4E141D]" />;
  return <>{children}</>;
}

const PrivateCRM = () => <PrivateRoute><CRM /></PrivateRoute>;

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
      <Route path="/login" component={Login} />
      <Route path="/crm" component={PrivateCRM} />
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
