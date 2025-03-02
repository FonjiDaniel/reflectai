import React from 'react'

function AuthLayout({children} : {children: React.ReactNode}) {
  return (
  <body className=''>
        <main>{children}</main>
      </body>
  )
}

export default AuthLayout
