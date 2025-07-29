import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProductProvider } from "./contexts/ProductContext";
import { SidebarProvider } from "./contexts/SidebarContext";

createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <ProductProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ProductProvider>
  </SidebarProvider>
);
