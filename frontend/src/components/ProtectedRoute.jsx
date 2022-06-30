import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
// import { useGetUserByIdQuery } from '../features/api/apiSlice'
import { useSelector } from "react-redux";
import Spinner from './Spinner';

const ProtectedRoute = ({ redirectPath = '/signin',  children  }) => {

    const { user, isLoading, isSuccess, isError } = useSelector((state)=>state.user)
    const navigate = useNavigate()

    useEffect(()=>{

        if(isError || !user) {
            // <Navigate to={redirectPath} replace />;
            navigate('/signin')
        }

    }, [])

    // if (isLoading) {
    //     return <Spinner />
    // }


    return !user ? null : children ? children : <Outlet />;
}

export default ProtectedRoute