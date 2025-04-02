"use client"
import React from 'react'
import { useMyAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation';


const HomePage = () => {

  const {isAuthenticated} =  useMyAuth();

if (isAuthenticated) return redirect('/home');

  return (
    <div>page</div>
  )
}

export default HomePage;