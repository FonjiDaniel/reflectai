"use client"
import React from 'react'
import { useMyAuth } from '@/hooks/useAuth'
import RecentDiaries from '@/components/RecentDiaries'
import ChartComponent from '@/components/Chart'

import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] });


const Home = () => {
  const { user } = useMyAuth();

  return (
    <div className='flex flex-col items-center scrollbar-custom'>
      <div className='flex justify-center mt-10'>
        <p className={`text-3xl font-semibold text-[#b7bdc1] ${orbitron.className}`}>
          {`Good Morning, ${user?.name}`}
        </p>
      </div>

    
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 w-full max-w-6xl'>
        {/* Recent Diaries Section */}
        <section className='overflow-hidden'>
          <div className="max-h-[300px] overflow-x-auto scrollbar-hide">
            <RecentDiaries />
          </div>
        </section>

        {/* Chart Section */}
        <section className='flex flex-col bg-white p-5 rounded-xl shadow-md'>
          <p className="text-lg font-semibold">Writing Stats</p>
          <ChartComponent />
        </section>
      </div>
    </div>
  );
};

export default Home;