import React from "react";
import { Route, Routes } from "react-router-dom";

import { AdminLogin } from "./pages/auth/Auth";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "./pages/dashboard/Dashboard";
import Posts from "./pages/post/Posts";
import AdminLayout from "./layout";
import User from "./pages/user/Users";

import Setting from "./pages/setting/setting";
import Ads from "./pages/ads/Ads";
import PreventRoute from "./components/preventRoute";
import ProductDetail from "./pages/post/product_detail";
import CreateProduct from "./pages/post/components/create_post";
import Categories from "./pages/categories/sendNoti";
import Orders from "./pages/orders";
import CreateOrder from "./pages/orders/components/create_order";
import OrderDetail from "./pages/orders/detail";
import ProductForm from "./pages/post/components/create_post";
import CreateOrEditOrder from "./pages/orders/components/create_order";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<PreventRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin" element={<AdminLayout />}>
              {/* Core Core Management */}
              <Route path="users" element={<User />} />
              <Route path="settings" element={<Setting />} />
              <Route path="categories" element={<Categories />} />
              <Route path="advertisements" element={<Ads />} />
              {/* Products Management Tree */}
              <Route path="products" element={<Posts />} />
              <Route path="products/create" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductDetail />} />{" "}
              {/* Moved down */}
              {/* Orders Management Tree */}
              <Route path="orders" element={<Orders />} />
              <Route path="orders/create" element={<CreateOrEditOrder />} />
              <Route
                path="orders/edit/:id"
                element={<CreateOrEditOrder />}
              />{" "}
              {/* Normalized path pattern */}
              <Route path="orders/:id" element={<OrderDetail />} />{" "}
              {/* Moved down */}
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
