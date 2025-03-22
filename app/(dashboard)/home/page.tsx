"use client"
import React from 'react'
import { useMyAuth } from '@/hooks/useAuth'
import RecentDiaries from '@/components/RecentDiaries'
import ChartComponent from '@/components/Chart'


//TODO  
// 1) Make the recent diaries section to be scrollable 
// (but the div can take a max of 5 for large devices and the other ones will be
//  covered by a shadow and the the scroll left icon will scroll it to the right to see 
// them like in the recent diaries part of notion home )
//

const Home = () => {
    const { user } = useMyAuth()
  


  return (
    <div className='flex flex-col items-center scrollbar-custom'>
      <div className='flex justify-center mt-10'>
        <p className='text-3xl font-semibold text-[#b7bdc1] '>{`Good Morning, ${user?.name}`}</p>
      </div>

      <div className='  mt-10 rounded-xl'>
        <RecentDiaries />
        {/* <ChartComponent /> */}



      </div>

    </div>
  )
}

export default Home

