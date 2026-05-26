import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./modules/auth/pages/LoginPage.tsx";
import DashboardLayout from "./modules/products/pages/DashboardLayout.tsx";
import WelcomeSection from "./modules/products/components/WelcomeSection.tsx";
import ProductsSection from "./modules/products/components/ProductsSection.tsx";
import { Toaster } from "sonner";
import { TooltipProvider } from "./modules/core/components/ui/tooltip.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<WelcomeSection />} />
            <Route path="products" element={<ProductsSection />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </StrictMode>,
);
