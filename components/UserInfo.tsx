import React from 'react'
import { Button } from './ui/button'
import { useUser, SignOutButton } from '@clerk/nextjs'

function UserInfo() {
  const { user, isLoaded } = useUser()
  return (
    <>

      <div className='flex items-center gap-2'>

        {isLoaded ? <p>Name: {user?.firstName}</p> : <div className="w-36 h-5 bg-gray-100 rounded-md animate-pulse"></div>}
        <SignOutButton>
          <Button className='bg-gray-400 text-white'
            variant="ghost"
            size="sm"
            aria-label="logout">
            logout
          </Button>
        </SignOutButton>

      </div>

    </>
  )
}

export default UserInfo
