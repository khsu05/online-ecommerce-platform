import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// Entry
import RoleSelection from "./pages/RoleSelection";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import SystemActivity from "./pages/admin/SystemActivity";

// Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import InventoryOverview from "./pages/seller/InventoryOverview";
import SalesPerformance from "./pages/seller/SalesPerformance";
import SellerEditProduct from "./pages/seller/SellerEditProduct";
import SellerInventoryProduct from "./pages/seller/SellerInventoryProduct";

// Buyer
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import ProductBrowsing from "./pages/buyer/ProductBrowsing";
import BrowsingHistory from "./pages/buyer/BrowsingHistory";
import BuyerOrderHistory from "./pages/buyer/BuyerOrderHistory";
import BuyerWishlist from "./pages/buyer/BuyerWishlist";
import AccountOverview from "./pages/buyer/AccountOverview";
import ProductDetails from "./pages/buyer/ProductDetails";
import BuyerOrderDetails from "./pages/buyer/BuyerOrderDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROLE SELECTION */}
        <Route
          path="/"
          element={<RoleSelection />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<UserManagement />}
        />

        <Route
          path="/admin/products"
          element={<ProductManagement />}
        />

        <Route
          path="/admin/orders"
          element={<OrderManagement />}
        />

        <Route
          path="/admin/system-activities"
          element={<SystemActivity />}
        />

        {/* SELLER */}
        <Route
          path="/seller"
          element={<SellerDashboard />}
        />

        <Route
          path="/seller/products"
          element={<SellerProducts />}
        />

        <Route
          path="/seller/products/:productId/edit"
          element={<SellerEditProduct />}
        />

        <Route
          path="/seller/products/:productId/inventory"
          element={<SellerInventoryProduct />}
        />

        <Route
          path="/seller/orders"
          element={<SellerOrders />}
        />

        <Route
          path="/seller/inventory"
          element={<InventoryOverview />}
        />

        <Route
          path="/seller/sales"
          element={<SalesPerformance />}
        />

        {/* BUYER */}
        <Route
          path="/buyer"
          element={<BuyerDashboard />}
        />

        <Route
          path="/buyer/products"
          element={<ProductBrowsing />}
        />

        <Route
          path="/buyer/products/:productId"
          element={<ProductDetails />}
        />

        <Route
          path="/buyer/history"
          element={<BrowsingHistory />}
        />

        <Route
          path="/buyer/orders"
          element={<BuyerOrderHistory />}
        />

        <Route
          path="/buyer/orders/:orderId"
          element={<BuyerOrderDetails />}
        />

        <Route
          path="/buyer/wishlist"
          element={<BuyerWishlist />}
        />

        <Route
          path="/buyer/account"
          element={<AccountOverview />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;