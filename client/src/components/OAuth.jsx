import { FcGoogle } from "react-icons/fc"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router"
import { app } from "../firebase.js"
import {
  signInSuccess,
  signInStarted,
  signInFailure,
} from "../redux/user/userSlice.js"
import { useDispatch } from "react-redux"
import { Spinner } from "flowbite-react"
import { useState } from "react"

const OAuth = () => {
  const dispatch = useDispatch()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  // const { currentUser, errorMessage, isLoading } = useSelector(
  //   (state) => state.user
  // )

  const [isLoading, setIsLoading] = useState(false)

  provider.setCustomParameters({ prompt: "select_account" })

  const navigate = useNavigate()

  const onGoogleClick = async () => {
    setIsLoading(true)
    dispatch(signInStarted())
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log(user)

      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          imgUrl: user.photoURL,
        }),
      })

      const responseJSON = await res.json()

      if (res.ok && responseJSON.success) {
        dispatch(signInSuccess(responseJSON.data))
        navigate("/")
      } else {
        dispatch(signInFailure(responseJSON.message))
      }
    } catch (error) {
      dispatch(signInFailure("Something went wrong"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={onGoogleClick}
      className={`bg-red-600 text-white rounded-lg h-10 flex items-center justify-center hover:bg-red-700 transition duration-500 ease-in-out ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          <span className="ml-2">Signing with Google...</span>
        </>
      ) : (
        <>
          <FcGoogle className="bg-white rounded-full text-xl" />
          <span className="ml-2">Continue with Google</span>
        </>
      )}
    </button>
  )
}

export default OAuth
