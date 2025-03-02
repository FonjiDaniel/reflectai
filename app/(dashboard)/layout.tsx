
import React from 'react'
import Sidebar from '@/components/sidebar/index'

function DashboardLayout( {children} : {children: React.ReactNode} ) {
  return (
    <main className='flex h-screen'>
    <Sidebar />
    <section className='flex h-full flex-1 flex-col'>
        <div className='remove-scrollbar h-full flex-1 overflow-auto bg-light-400 px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10'>
            {children}
        </div>

    </section>
</main>
  )
}

export default DashboardLayout;
