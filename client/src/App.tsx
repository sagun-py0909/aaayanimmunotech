import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CRM from "./pages/CRM";
import Login from "./pages/Login";
import { BlogDetail, Blogs, Contact, DynamicBlogDetail, ProductDetail, Sectors, Support } from "./pages/Pages";
import BlogEditor from "./pages/BlogEditor";
import { useEffect, useState } from "react";

function Router() {
  const PrivateCRM = () => <PrivateRoute><CRM /></PrivateRoute>;
  const PrivateBlogEditor = () => <PrivateRoute><BlogEditor /></PrivateRoute>;

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/login" component={Login} />
      <Route path="/crm" component={PrivateCRM} />
      <Route path="/crm/blogs" component={PrivateBlogEditor} />
      <Route path="/crm/blogs/new" component={PrivateBlogEditor} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/sectors" component={Sectors} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/blogs/how-to-specify-a-recovery-room" component={BlogDetail} />
      <Route path="/blogs/:slug" component={DynamicBlogDetail} />
      <Route path="/support" component={Support} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "anonymous">("loading");
  useEffect(() => { fetch("/api/auth/session").then((response) => setStatus(response.ok ? "authenticated" : "anonymous")).catch(() => setStatus("anonymous")); }, []);
  if (status === "loading") return <div className="min-h-screen bg-[#20201e]" />;
  return status === "authenticated" ? children : <RedirectToLogin />;
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
