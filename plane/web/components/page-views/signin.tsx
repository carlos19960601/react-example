"use client"

import Image from "next/image"
import { useState } from "react"
import { Spinner } from "../ui/spinners"

export const SignInView = () => {
  const [isLoading, setLoading] = useState(false)
  return (
    <>
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <>
          <>
            <div className="fixed top-11 left-7 bg-custom-background-100">
              <Image src="/plane-logos/blue-without-text.png" alt="Plane Logo" width={30} height={30} />
            </div>
          </>
          <>
            <div className="h-full ">
              <h1 className="text-center text-2xl text-custom-text-100">Sign in to Plane</h1>
            </div>
          </>
        </>
      )}
    </>
  )
}
