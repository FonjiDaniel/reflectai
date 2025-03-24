
import React from 'react'
import Sidebar from '@/components/sidebar/index'




function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (



    <main className='flex h-screen'>
      <Sidebar />
      <section className='flex h-full flex-1 flex-col bg-[#191919]'>
        <div className=' h-full flex-1 overflow-x-hidden scrollbar-custom bg-light-400 px-[100px] py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 '>
          {children}
        </div>

      </section>
    </main>

  )
}

export default DashboardLayout;
