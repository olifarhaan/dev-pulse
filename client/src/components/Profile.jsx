import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  TextInput,
} from "flowbite-react"
import { MdAlternateEmail, MdOutlineEmail } from "react-icons/md"
import { HiOutlineUser, HiOutlineExclamationCircle } from "react-icons/hi"
import { PiPasswordBold } from "react-icons/pi"
import { CiCamera } from "react-icons/ci"

import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

import { customFormFields } from "../assets/customThemes.js"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

import { useSelector } from "react-redux"
import isImage from "../utils/validateImage.js"
import {
  updateUserStarted,
  updateUserSuccess,
  updateUserFailure,
  resetErrorMessage,
  deleteUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice.js"
import { useDispatch } from "react-redux"
// import signout from "../utils/handleSignout.js"
import useErrorMessageTimeout from "../hooks/useErrorMessageTimeout.js"
import useSignout from "../hooks/useSignout.js"
import useDeleteUser from "../hooks/useDeleteUser.js"
import uploadImageToDatabase from "../utils/uploadImageToFirebase.js"
import { roles } from "../utils/constants.js"

export default function Profile() {
  const { currentUser, errorMessage, loading } = useSelector(
    (state) => state.user
  )
  const [uploadImage, setUploadImage] = useState(null)
  const [uploadImageUrl, setUploadImageUrl] = useState(null)
  const [uploadImageProgress, setUploadImageProgress] = useState(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [message, setMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name,
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    imgUrl: currentUser.imgUrl,
  })

  const imageRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleSignout = useSignout()
  const handleDeleteUser = useDeleteUser()
  console.log(formData)

  const handleChange = (e) => {
    setFormData((prevData) => {
      // if (e.target.value.trim() === "") {
      //   const { [e.target.id]: _, ...updatedData } = prevData
      //   return updatedData
      // }

      return {
        ...prevData,
        [e.target.id]:
          e.target.id === "name" ? e.target.value : e.target.value.trim(),
      }
    })
  }

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0]
  //   if (file) {
  //     if (!isImage(file)) {
  //       setMessage({ text: "Only images are allowed", type: "failure" })
  //       return
  //     }
  //     setUploadImage(file)
  //     setUploadImageUrl(URL.createObjectURL(file))
  //   }
  // }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!isImage(file)) {
        setMessage({ text: "Only images are allowed", type: "failure" })
        return
      }

      setUploadImage(file)
      setUploadImageUrl(URL.createObjectURL(file)) //creating a temporary URL for better UX
      setIsUploadingImage(true)

      uploadImageToDatabase(file, setUploadImageProgress)
        .then((downloadURL) => {
          console.log(downloadURL, "---------------------------")
          setUploadImageUrl(downloadURL)
          setFormData({ ...formData, imgUrl: downloadURL })
        })
        .catch((error) => {
          setMessage({ text: "Could not upload image", type: "failure" })
          setUploadImage(null)
          setUploadImageUrl(null)
          // setUploadImageProgress(null)
        })
        .finally(() => {
          setIsUploadingImage(false)
          setUploadImageProgress(null)
        })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isUploadingImage) {
      setMessage({ text: "Image is uploading please wait", type: "failure" })
      return
    }
    dispatch(updateUserStarted())
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.username === ""
    ) {
      dispatch(updateUserFailure("Fields can't be empty"))
      setMessage({ text: "Fields can't be empty", type: "failure" })
      return
    }

    const requestBody = {}
    if (formData.name !== currentUser.name) {
      requestBody.name = formData.name
    }

    if (formData.email !== currentUser.email) {
      requestBody.email = formData.email
    }

    if (formData.username !== currentUser.username) {
      requestBody.username = formData.username
    }

    if (formData.password !== "") {
      requestBody.password = formData.password
    }

    if (formData.imgUrl !== currentUser.imgUrl) {
      requestBody.imgUrl = formData.imgUrl
    }

    try {
      const res = await fetch(`/api/v1/user/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      const responseJSON = await res.json()
      if (res.ok) {
        dispatch(updateUserSuccess(responseJSON.data))
        setMessage({ text: responseJSON.message, type: "success" })
      } else {
        dispatch(updateUserFailure(responseJSON.message))
        // setMessage({ text: responseJSON.message, type: "failure" })
      }
    } catch (error) {
      dispatch(updateUserFailure("Something went wrong"))
      // setMessage({ text: responseJSON.message, type: "failure" })
    }
  }

  // useEffect(() => {
  //   if (uploadImage) {
  //     uploadImageToDatabase(uploadImage)
  //   }
  // }, [uploadImage])

  useEffect(() => {
    if (errorMessage && errorMessage !== "") {
      setMessage({ text: errorMessage, type: "failure" })
    }
  }, [errorMessage])

  useErrorMessageTimeout(errorMessage)

  useEffect(() => {
    let timeoutId

    if (message) {
      timeoutId = setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

    return () => clearTimeout(timeoutId)
  }, [message])

  useEffect(() => {
    if (uploadImageProgress) {
      uploadImageProgress < 100
        ? setMessage({
            text: `Image uploading ${uploadImageProgress}%`,
            type: "info",
          })
        : setMessage({ text: "Image uploaded successfully", type: "success" })
    }
  }, [uploadImageProgress])

  // const uploadImageToDatabase = async (uploadImage) => {
  //   setIsUploadingImage(true)
  //   const storage = getStorage(app)
  //   const fileName =
  //     uploadImage.name +
  //     new Date().getTime() +
  //     Math.random().toString(36).slice(-8)
  //   const storageRef = ref(storage, fileName)
  //   const uploadTask = uploadBytesResumable(storageRef, uploadImage)
  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       progress < 100
  //         ? setMessage({
  //             text: `Image uploading ${progress.toFixed(0)}%`,
  //             type: "info",
  //           })
  //         : setMessage({ text: "Image uploaded successfully", type: "success" })
  //       setUploadImageProgress(progress.toFixed(0))
  //     },
  //     (error) => {
  //       // setUploadImageErrorMessage("Could not upload image")
  //       setMessage({ text: "Could not upload image", type: "failure" })
  //       setUploadImageProgress(null)
  //       setUploadImage(null)
  //       setUploadImageUrl(null)
  //       setIsUploadingImage(false)
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         setUploadImageUrl(downloadURL)
  //         setFormData({ ...formData, imgUrl: downloadURL })
  //         setIsUploadingImage(false)
  //       })
  //     }
  //   )
  // }

  return (
    <div className="max-w-sm mx-auto p-3 my-16 flex flex-col gap-3">
      <h1 className="text-center">My Profile</h1>
      <form
        className="w-full flex flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageRef}
          hidden
          aria-hidden
        />
        <div
          className="relative self-center rounded-full shadow-lg "
          onClick={() => imageRef.current.click()}
        >
          {uploadImageProgress && (
            <CircularProgressbar
              value={uploadImageProgress || 0}
              // text={`${uploadImageProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgb(4,74,219)`, //we can add rgba(4,74,219, ${uploadImageProgress/100})
                },
              }}
            />
          )}
          <img
            src={uploadImageUrl || currentUser.imgUrl}
            alt="User profile"
            className={`object-center cursor-pointer w-20 h-20 rounded-full border-4 border-gray-200 ${
              uploadImage &&
              uploadImageProgress &&
              uploadImageProgress < 100 &&
              "opacity-60"
            }`}
          />
          <CiCamera className="absolute -right-1 bottom-4 bg-accentOrange text-white text-lg rounded-full p-[2px]" />
        </div>

        <div>
          {message && (
            <Alert
              className="transition duration-500 ease-in-out"
              color={message.type}
            >
              {message.text}
            </Alert>
          )}
        </div>

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
          placeholder="We don't store your password"
          onChange={handleChange}
          value={formData.password}
        />

        <button
          className={`bg-accentOrange text-white rounded-lg h-10 hover:bg-accentBlue transition duration-500 ease-in-out ${
            isUploadingImage || loading ? "opacity-50" : "opacity-100"
          }`}
          disabled={isUploadingImage || loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="ml-2">Updating Profile...</span>
            </>
          ) : (
            "Update Profile"
          )}
        </button>

        {(currentUser.role === roles.ADMIN ||
          currentUser.role === roles.AUTHOR) && (
          <button
            className="bg-accentBlue text-white rounded-lg h-10 hover:bg-accentOrange transition duration-500 ease-in-out"
            onClick={() => navigate("/create-post")}
          >
            Create a post
          </button>
        )}
        <div className="text-red-500 flex justify-between">
          <span
            onClick={() => setShowModal(true)}
            className="cursor-pointer"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignout}
            className="cursor-pointer"
          >
            Sign Out
          </span>
        </div>
      </form>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setShowModal(false)
                  handleDeleteUser()
                }}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}
