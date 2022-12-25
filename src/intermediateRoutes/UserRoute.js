import React from 'react'
import { Navigate } from 'react-router-dom';

export default function UserRoute({children}) {

  const user = JSON.parse(localStorage.getItem("user"));
  if(!user.isAdmin){
    return <Navigate replace to="/home" />
  }
  return children;
}