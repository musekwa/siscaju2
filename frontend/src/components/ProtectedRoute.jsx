import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
// import { useGetUserByIdQuery } from '../features/api/apiSlice'
import { useSelector } from "react-redux";

const ProtectedRoute = ({ user, redirectPath = '/signin',  children  }) => {


    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }
    return children ? children : <Outlet />;
}

export default ProtectedRoute