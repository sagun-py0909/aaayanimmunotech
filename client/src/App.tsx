import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CRM from "./pages/CRM";
import Login, { isCRMAuthenticated } from "./pages/Login";
import { BlogDetail, Blogs, Contact, ProductDetail, Sectors, Support } from "./pages/Pages";

function Router() {
  const PrivateCRM = () => isCRMAuthenticated() ? <CRM /> : <RedirectToLogin />;

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/login" component={Login} />
      <Route path="/crm" component={PrivateCRM} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/sectors" component={Sectors} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/blogs/how-to-specify-a-recovery-room" component={BlogDetail} />
      <Route path="/support" component={Support} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function RedirectToLogin() {
  window.location.replace("/login");
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
