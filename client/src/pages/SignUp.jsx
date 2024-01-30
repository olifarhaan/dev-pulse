import { Alert, Label, Spinner, TextInput } from "flowbite-react"
import { MdAlternateEmail, MdOutlineEmail } from "react-icons/md"
import { HiOutlineUser } from "react-icons/hi"
import { PiPasswordBold } from "react-icons/pi"

import { customFormFields } from "../assets/customThemes.js"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import OAuth from "../components/OAuth.jsx"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()
  console.log(formData)

  const handleChange = (e) => {
    if (errorMessage) setErrorMessage(null)
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]:
        e.target.id === "name" ? e.target.value : e.target.value.trim(),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("form data-----------", formData)

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.username === "" ||
      formData.password === ""
    ) {
      setErrorMessage("All fields are required")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const responseJSON = await res.json()
      if (res.ok && responseJSON.success) {
        navigate("/sign-in")
      } else {
        setErrorMessage(responseJSON.message)
      }
    } catch (error) {
      setErrorMessage("Something went wrong")
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="max-w-sm mx-auto p-3 my-16 flex flex-col gap-3">
        <h1 className="text-center">Sign Up</h1>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <TextInput
            theme={customFormFields}
            type="text"
            id="name"
            addon={<HiOutlineUser />}
            placeholder="Full name"
            autoComplete="name"
            onChange={handleChange}
            value={formData.name}
          />
          <TextInput
            theme={customFormFields}
            type="text"
            id="username"
            addon={<MdAlternateEmail />}
            placeholder="Username"
            autoComplete="username"
            onChange={handleChange}
            value={formData.username}
          />
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
                <span className="ml-2">Signing Up...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="text-center">
          Have an account?{" "}
          <Link
            to="/sign-in"
            className="text-accentBlue hover:underline"
          >
            Sign in
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
