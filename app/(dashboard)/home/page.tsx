"use client"
import React, { useState, useEffect } from 'react'
import { useMyAuth } from '@/hooks/useAuth'
import RecentDiaries from '@/components/RecentDiaries'
import ChartComponent from '@/components/Chart'
import TrackingCalendar from '@/components/TrackingCalendar'
import UserStreak from '@/components/UserStreak'
import UserWordCount from '@/components/UserWordCount'
import UserProgressCircle from '@/components/UserProgressCircle'

import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] });

const Home = () => {
  const { user, token } = useMyAuth();
  const [timeOfDay, setTimeOfDay] = useState<string>('');

  useEffect(() => {
    const getTimeOfDay = () => {
      const time = new Date().getHours();
      const hour = time;
      if (hour < 12) {
        setTimeOfDay("Morning")
      } else if (hour < 18) {
        setTimeOfDay("Afternoon");
      } else {
        setTimeOfDay("Evening");
      }
    }
    getTimeOfDay();
  }, [])

  return (
    <div className='flex flex-col items-center scrollbar-custom'>
      <div className='flex justify-center mt-10'>
        <p className={`text-3xl font-semibold text-[#b7bdc1] ${orbitron.className}`}>
          {`Good ${timeOfDay}, ${user?.name}`}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-1 gap-8 mt-10 w-full max-w-6xl'>
        {/* Full Width Recent Diaries Section - First Row */}
        <div className='lg:col-span-3 overflow-hidden'>
          <div className="max-h-[300px] overflow-x-auto scrollbar-hide">
            <RecentDiaries />
          </div>
        </div>

        {/* Word Count Section */}
        <section className='bg-transparent p-5 rounded-xl shadow-md border border-[#3b3a3a]'>
          <UserWordCount />
        </section>

        {/* Progress Circle Section */}
        <section className='bg-transparent p-5 rounded-xl shadow-md border border-[#3b3a3a]'>
          <UserProgressCircle />
        </section>

        {/* User Streak Section */}
        <section className='bg-transparent p-5 rounded-xl shadow-md border border-[#3b3a3a]'>
          <UserStreak userId={user.id} token={token} />
        </section>

        {/* Writing Stats Chart Section */}
        <section className=' bg-transparent p-5 rounded-xl shadow-md border border-[#3b3a3a]'>
          <p className="text-lg font-semibold text-[#b7bdc1] mb-4">Writing Stats</p>
          <ChartComponent />
        </section>

        {/* Tracking Calendar Section */}
        
        <section className='bg-transparent lg:col-span-2 p-5 rounded-xl shadow-md border border-[#3b3a3a]'>
          <TrackingCalendar />
        </section>
      </div>
    </div>
  );
};

export default Home;