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

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<PreventRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="customers" element={<User />} />
              <Route path="settings" element={<Setting />} />
              <Route path="products" element={<Posts />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/create" element={<CreateOrder />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="advertisements" element={<Ads />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
