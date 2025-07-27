import React from 'react'
import {Header, Sidebar, Footer} from "../components"
import { Outlet } from 'react-router-dom'

const FrontendLayout = () => {
    return (
        <>
            <Header />
            <Sidebar />
            <Outlet />
            <Footer />
        </>
    )
}

export default FrontendLayout
