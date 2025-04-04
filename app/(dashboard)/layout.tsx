
import React from 'react'
import Sidebar from '@/components/sidebar/index'




function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (



    <main className='flex h-screen'>
      <Sidebar />
      <section className='flex h-full flex-1 flex-col bg-[#191919]'>
        <div className=' h-full flex-1 overflow-x-hidden scrollbar-custom max-lg:justify-center  max-sm:px-[20px] md:px-[100px] py-7 sm:mr-7 md:mb-7 '>
          {children}
        </div>

      </section>
    </main>

  )
}

export default DashboardLayout;
