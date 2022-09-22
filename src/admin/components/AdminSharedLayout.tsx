import React from 'react'
import {AdminAuthProviderWrapper} from '../../context/adminAuth.context'
import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavBar'
import { Footer } from '../../components/Footer'

export const AdminSharedLayout = () => {
  return (
    <AdminAuthProviderWrapper>
        <AdminNavbar/>
        <Outlet/>
        <Footer backgroundColor={'red'}/>
    </AdminAuthProviderWrapper>
  )
}
