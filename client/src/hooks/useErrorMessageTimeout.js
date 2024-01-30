// useErrorMessageTimeout.js
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { resetErrorMessage } from "../redux/user/userSlice.js" // Replace with your actual action

const useErrorMessageTimeout = (errorMessage, timeout = 5000) => {
  const dispatch = useDispatch()

  useEffect(() => {
    let timeoutId

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        dispatch(resetErrorMessage())
      }, timeout)
    }
    console.log(timeoutId)

    return () => {
      clearTimeout(timeoutId)
      if (errorMessage) {
        dispatch(resetErrorMessage())
      }
    }
  }, [errorMessage, timeout, dispatch])
}

export default useErrorMessageTimeout
