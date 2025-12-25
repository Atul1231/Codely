import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1>welcome to my app</h1>
     <button className='btn btn-primary' onClick={()=> toast.success("This is a success toast")}>Click me</button>
     <SignedOut>
      <SignInButton mode='modal' />
      </SignedOut>
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <UserButton/>
      <Toaster toastOptions={{duration:3000}}/>
    </>
  )
}

export default App
