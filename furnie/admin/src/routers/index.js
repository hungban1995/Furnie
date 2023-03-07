import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/index";
import User from "../pages/user";
import Product from "../pages/product";
import CategoriesProducts from "../pages/categories";
import Profile from "../pages/user/manager";
import PostCategory from "../pages/post/post-categories";
import Orders from "../pages/orders/index";
import PostManager from "../pages/post/postManager";
import HomePageManager from "../pages/homePageManger";
export default function RouterPage() {
  return (
    <Routes>
      <Route path="/admin" element={<Home />} />
      <Route path="/admin/users" element={<User />} />
      <Route path="/admin/products" element={<Product />} />
      <Route path="/admin/product-category" element={<CategoriesProducts />} />
      <Route path="/admin/user/profile" element={<Profile />} />
      <Route path="/admin/post-categories" element={<PostCategory />} />
      <Route path="/admin/orders" element={<Orders />} />
      <Route path="/admin/posts" element={<PostManager />} />
      <Route path="/admin/home-page-manager" element={<HomePageManager />} />

      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>404 Page not found</p>
          </main>
        }
      />
    </Routes>
  );
}
