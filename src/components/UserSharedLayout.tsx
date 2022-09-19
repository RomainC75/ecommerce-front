import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { Footer } from './Footer'
import {AuthProviderWrapper} from '../context/auth.context'
import { CartProviderWrapper } from '../context/cart.context';
import { FilterProviderWrapper } from '../context/filter.context';


export const UserSharedLayout = () => {
  return (
    <AuthProviderWrapper>
        <CartProviderWrapper>
          <FilterProviderWrapper>
            <Navbar/>
            <Outlet/>
            <Footer/>
          </FilterProviderWrapper>  
        </CartProviderWrapper>
    </AuthProviderWrapper>
  )
}
