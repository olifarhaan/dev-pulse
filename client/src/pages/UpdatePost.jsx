import {
  Alert,
  Button,
  FileInput,
  Progress,
  Select,
  TextInput,
} from "flowbite-react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useEffect, useMemo, useState } from "react"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useNavigate, useParams } from "react-router-dom"
import { category } from "../../../api/utils/constants"
import uploadImageToDatabase from "../utils/uploadImageToFirebase"
import ButtonComponent from "../components/ButtonComponent"
import { roles } from "../utils/constants"
import { useSelector } from "react-redux"

export default function UpdatePost() {
  const { postId } = useParams()
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState({})
  const [loading, setLoading] = useState(true)

  const { currentUser } = useSelector((state) => state.user)

  const navigate = useNavigate()

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setMessage({ type: "failure", text: "Please select an image" })
        return
      }
      const downloadURL = await uploadImageToDatabase(
        file,
        setImageUploadProgress
      )
      setImageUploadProgress(null)
      setFormData({ ...formData, image: downloadURL })
    } catch (error) {
      setMessage({ type: "failure", text: error.message })
      setImageUploadProgress(null)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res = null
        if (
          currentUser.role === roles.AUTHOR ||
          currentUser.role === roles.ADMIN
        ) {
          res = await fetch(`/api/v1/post/?postId=${postId}`, {
            method: "GET",
          })
        }
        const responseJSON = await res.json()
        if (res.ok) {
          console.log(responseJSON.data.posts, "-------------posts")
          setFormData(responseJSON.data.posts[0])
          // setFormData({...responseJSON.data.posts[0]})
        } else {
          setMessage(responseJSON.data.message)
        }
      } catch (error) {
        setMessage(error.message)
        console.log(error.message)
      }
    }
    if (currentUser.role === roles.ADMIN || currentUser.role === roles.AUTHOR) {
      fetchPosts()
    }
    setLoading(false)
  }, [postId])

  console.log(formData, "-----------------")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/v1/post/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const jsonResponse = await res.json()
      if (!res.ok) {
        setMessage({ type: "failure", text: jsonResponse.message })
        return
      }

      if (res.ok) {
        navigate(`/post/${jsonResponse.data.slug}`)
      }
    } catch (error) {
      setMessage({ type: "failure", text: "Something went wrong" })
    }
  }

  useEffect(() => {
    let messageTimer
    if (message) {
      messageTimer = setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    return () => clearTimeout(messageTimer)
  }, [message])

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // basic formatting
      ["blockquote", "code-block"],
      [{ header: [2, 3, 4, 5, 6, false] }], // custom header values with false for disabling h1
      [{ list: "ordered" }, { list: "bullet" }], // lists
      [{ indent: "-1" }, { indent: "+1" }], // indentation
      // ["link", "image"], // links and images
      ["link", "video"], // links and images
      // ["table"], // table option
      ["clean"], // remove formatting
    ],
  }

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "header",
    "list",
    "bullet",
    "indent",
    "link",
    // "image",
    "video",
    "blockquote",
    "code-block",
  ]

  if (loading) return <>Loading....</>

  return (
    <section className="p-3 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      {message && message.text && message.text.length() > 0 && (
        <Alert
          className="my-2"
          color={message.type}
        >
          {message.text}
        </Alert>
      )}
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            {Object.values(category).map((val, index) => (
              <option
                key={index}
                value={val}
              >
                {val}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-2 border-gray-300 border-dashed p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            type="button"
            className={`bg-accentOrange text-white rounded-lg h-10 px-2 hover:bg-accentBlue transition duration-500 ease-in-out text-sm ${
              imageUploadProgress ? "opacity-50" : "opacity-100"
            }`}
            onClick={handleUpdloadImage}
          >
            {imageUploadProgress ? "Uploading ..." : "Upload Image"}
          </button>
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt="Blog cover image"
            className="h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className=""
          required
          modules={modules}
          formats={formats}
          onChange={(value) => {
            setFormData({ ...formData, content: value })
          }}
          value={formData.content}
        />
        <button
          className={`bg-accentBlue text-white rounded-lg w-full h-10 px-2 hover:bg-accentOrange transition duration-500 ease-in-out text-sm ${
            imageUploadProgress ? "opacity-50" : "opacity-100"
          }`}
        >
          {imageUploadProgress ? "Publishing ..." : "Publish blog"}
        </button>
      </form>
    </section>
  )
}
