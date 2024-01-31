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

const Dashboardcomments = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [userComments, setUserComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  useEffect(() => {
    console.log("first--------------")

    const fetchComments = async () => {
      try {
        let res = null
        if (currentUser.role === roles.ADMIN) {
          res = await fetch(`/api/v1/comment`, {
            method: "GET",
          })
        } else if (currentUser.role === roles.AUTHOR) {
          res = await fetch(`/api/v1/comment/?userId=${currentUser._id}`, {
            method: "GET",
          })
        }
        const responseJSON = await res.json()

        if (res.ok) {
          console.log(responseJSON.data.comments)

          setUserComments(responseJSON.data.comments)
          if (responseJSON.data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.role === roles.ADMIN || currentUser.role === roles.AUTHOR) {
      fetchComments()
    }
  }, [currentUser._id])

  const handleDeleteComment = async () => {
    setShowModal(false)
    try {
      const res = await fetch(
        `/api/v1/comment/${commentIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      )
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        )
      }
    } catch (error) {
      console.log(error.message)
    }
    setCommentIdToDelete(null)
  }

  const handleShowMore = async () => {
    const startIndex = userComments.length
    try {
      const res = await fetch(
        `/api/v1/comment/?userId=${currentUser._id}&startIndex=${startIndex}`,
        {
          method: "GET",
        }
      )
      const responseJSON = await res.json()
      if (res.ok) {
        setUserComments((prev) => [...prev, ...responseJSON.data.comments])
        if (responseJSON.data.comments.length < 9) {
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
      (currentUser.role === roles.AUTHOR && userComments.length > 0) ? (
        <>
          <Table
            hoverable
            className="shadow-md"
          >
            <TableHead>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Comment</TableHeadCell>
              <TableHeadCell>Likes</TableHeadCell>
              <TableHeadCell>Post ID</TableHeadCell>
              <TableHeadCell>User ID</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {userComments.map((comment) => (
              // divide-y is used to add some spacing between the rows
              <TableBody
                className="divide-y"
                key={comment._id}
              >
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {new Date(comment.updatedAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    {/* <Link to={`/post/${comment.slug}`}> */}
                    {truncate(comment.content, 40)}
                    {/* </Link> */}
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell>{comment.postId}</TableCell>
                  <TableCell>{comment.userId}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setCommentIdToDelete(comment._id)
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
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
        <p>You have no comments yet!</p>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteComment}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal(false)
                  setCommentIdToDelete(null)
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

export default Dashboardcomments
