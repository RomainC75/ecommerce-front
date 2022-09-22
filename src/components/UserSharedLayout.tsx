import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { AuthProviderWrapper } from "../context/auth.context";
import { CartProviderWrapper } from "../context/cart.context";
import { FilterProviderWrapper } from "../context/filter.context";

import './style/userSharedLayout.css'

export const UserSharedLayout = () => {
  return (
    <AuthProviderWrapper>
      <CartProviderWrapper>
        <FilterProviderWrapper>
          <Navbar />
          <div className="divOutlet">
            <Outlet />
          </div>
          <Footer backgroundColor="green"/>
        </FilterProviderWrapper>
      </CartProviderWrapper>
    </AuthProviderWrapper>
  );
};
