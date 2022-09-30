import React from 'react'
import {AdminAuthProviderWrapper} from '../../context/adminAuth.context'
import { Link, Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavBar'
import { Footer } from '../../components/Footer'

export const AdminSharedLayout = () => {
  return (
    <AdminAuthProviderWrapper>
        <AdminNavbar/>
        <Link to="/admin/orders">Orders</Link>
        <br/>
        <Link to="/admin/chat">Chat</Link>
        <Outlet/>
        <Footer backgroundColor={'red'}/>
    </AdminAuthProviderWrapper>
  )
}
