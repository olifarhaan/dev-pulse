import { Alert, Label, Spinner, TextInput } from "flowbite-react"
import { MdAlternateEmail, MdOutlineEmail } from "react-icons/md"
import { HiOutlineUser } from "react-icons/hi"
import { PiPasswordBold } from "react-icons/pi"

import { customFormFields } from "../assets/customThemes.js"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  signInSuccess,
  signInStarted,
  signInFailure,
} from "../redux/user/userSlice.js"
import userReducer from "../redux/user/userSlice.js"
import { useDispatch, useSelector } from "react-redux"
import OAuth from "../components/OAuth.jsx"
import useErrorMessageTimeout from "../hooks/useErrorMessageTimeout.js"

export default function SignUp() {
  const dispatch = useDispatch()

  const { errorMessage, loading } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()
  console.log(formData)

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]:
        e.target.id === "name" ? e.target.value : e.target.value.trim(),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(signInStarted())

    if (formData.email === "" || formData.password === "") {
      dispatch(signInFailure("All fields are required"))
      return
    }

    try {
      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    }
  }

  useErrorMessageTimeout(errorMessage)

  return (
    <div>
      <div className="max-w-sm mx-auto p-3 my-16 flex flex-col gap-3">
        <h1 className="text-center">Sign In</h1>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <TextInput
            theme={customFormFields}
            type="text"
            id="email"
            addon={<MdOutlineEmail />}
            placeholder="Email"
            autoComplete="email"
            onChange={handleChange}
            value={formData.email}
          />
          <TextInput
            theme={customFormFields}
            type="password"
            id="password"
            addon={<PiPasswordBold />}
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
          />
          <button
            className={`bg-accentOrange text-white rounded-lg h-10 hover:bg-accentBlue transition duration-500 ease-in-out ${
              loading ? "opacity-50" : "opacity-100"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="text-center">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-accentBlue hover:underline"
          >
            Sign up
          </Link>
        </div>
        <div className="flex items-center before:border-t-[1px] before:flex-1 after:border-t-[1px] after:flex-1">
          <p className="text-center font-semibold mx-2">OR</p>
        </div>
        <OAuth />
        <div>
          {errorMessage && (
            <Alert
              className="transition duration-500 ease-in-out"
              color="failure"
            >
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
