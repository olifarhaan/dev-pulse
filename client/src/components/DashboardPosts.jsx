import React, { useEffect, useState } from "react"
import { roles } from "../../../api/utils/constants"
import { useSelector } from "react-redux"
import { HiOutlineExclamationCircle } from "react-icons/hi"
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react"
import { Link } from "react-router-dom"

const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState(null)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res = null
        if (currentUser.role === roles.ADMIN) {
          res = await fetch(`/api/v1/post`, {
            method: "GET",
          })
        } else if (currentUser.role === roles.AUTHOR) {
          res = await fetch(`/api/v1/post/?userId=${currentUser._id}`, {
            method: "GET",
          })
        }
        const responseJSON = await res.json()
        if (res.ok) {
          setUserPosts(responseJSON.data.posts)
          if (responseJSON.data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.role === roles.ADMIN || currentUser.role === roles.AUTHOR) {
      fetchPosts()
    }
  }, [currentUser._id])

  const handleDeletePost = async () => {
    setShowModal(false)
    try {
      const res = await fetch(
        `/api/v1/post/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      )
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        )
      }
    } catch (error) {
      console.log(error.message)
    }
    setPostIdToDelete(null)
  }

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(
        `/api/v1/post/?userId=${currentUser._id}&startIndex=${startIndex}`,
        {
          method: "GET",
        }
      )
      const responseJSON = await res.json()
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...responseJSON.data.posts])
        if (responseJSON.data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  function truncate(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "..."
    } else {
      return str
    }
  }

  return (
    <div className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.role === roles.ADMIN ||
      (currentUser.role === roles.AUTHOR && userPosts.length > 0) ? (
        <>
          <Table
            hoverable
            className="shadow-md"
          >
            <TableHead>
              <TableHeadCell>Date updated</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>
                <span>Edit</span>
              </TableHeadCell>
            </TableHead>
            {userPosts.map((post) => (
              // divide-y is used to add some spacing between the rows
              <TableBody
                className="divide-y"
                key={post._id}
              >
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {new Date(post.updatedAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {truncate(post.title, 40)}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setPostIdToDelete(post._id)
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeletePost}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal(false)
                  setPostIdToDelete(null)
                }}
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

export default DashboardPosts
