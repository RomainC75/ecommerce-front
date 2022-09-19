import React from 'react'
import {AdminAuthProviderWrapper} from '../../context/adminAuth.context'
import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavBar'
import { AdminFooter } from './AdminFooter'

export const AdminSharedLayout = () => {
  return (
    <AdminAuthProviderWrapper>
        <AdminNavbar/>
        <Outlet/>
        <AdminFooter/>
    </AdminAuthProviderWrapper>
  )
}
