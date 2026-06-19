import React from "react";
import { Route, Routes } from "react-router-dom";

import { AdminLogin } from "./pages/auth/Auth";
import { Toaster } from "@/components/ui/sonner";

import Dashboard from "./pages/dashboard/Dashboard";
import User from "./pages/user/Users";
import Setting from "./pages/setting/setting";
import Ads from "./pages/ads/Ads";
import Categories from "./pages/categories/sendNoti";
import Posts from "./pages/post/Posts";
import ProductDetail from "./pages/post/product_detail";
import ProductForm from "./pages/post/components/create_post";

import Orders from "./pages/orders";
import OrderDetail from "./pages/orders/detail";
import CreateOrEditOrder from "./pages/orders/components/create_order";

import AdminLayout from "./layout";
import PreventRoute from "./components/preventRoute";
import Customer from "./pages/customer/customer";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<PreventRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="users" element={<User />} />
            <Route path="customers" element={<Customer />} />

            <Route path="settings" element={<Setting />} />

            <Route path="categories" element={<Categories />} />

            <Route path="advertisements" element={<Ads />} />

            <Route path="products" element={<Posts />} />
            <Route path="products/create" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductDetail />} />

            <Route path="orders" element={<Orders />} />
            <Route path="orders/create" element={<CreateOrEditOrder />} />
            <Route path="orders/edit/:id" element={<CreateOrEditOrder />} />
            <Route path="orders/:id" element={<OrderDetail />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
