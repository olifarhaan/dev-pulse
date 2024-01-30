// useSignout.js
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { signoutSuccess } from "../redux/user/userSlice.js" // Replace with your actual action

const useSignout = () => {
  const dispatch = useDispatch()

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/v1/auth/signout`, {
        method: "POST",
      })

      const responseJSON = await res.json()

      if (res.ok) {
        dispatch(signoutSuccess(responseJSON.message))
      }
    } catch (error) {
      console.error("Signout failed:", error)
    }
  }

  return handleSignout
}

export default useSignout
