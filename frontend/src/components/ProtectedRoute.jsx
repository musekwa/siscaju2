import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
// import { useGetUserByIdQuery } from '../features/api/apiSlice'
import { useSelector } from "react-redux";
import Spinner from './Spinner';

const ProtectedRoute = ({ redirectPath = '/signin',  children  }) => {

    const { user, isLoading, isSuccess, isError } = useSelector((state)=>state.user)

    useEffect(()=>{

        if(isError || !user) {
            return <Navigate to={redirectPath} replace />;
        }

    }, [isError, user, isLoading])

    if (isLoading) {
        return <Spinner />
    }


    return children ? children : <Outlet />;
}

export default ProtectedRoute