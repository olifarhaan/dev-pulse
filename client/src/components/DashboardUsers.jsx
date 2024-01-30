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

const DashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/v1/user`, {
          method: "GET",
        })
        const responseJSON = await res.json()
        if (res.ok) {
          setUsers(responseJSON.data.users)
          if (responseJSON.data.users.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.role === roles.ADMIN) {
      fetchPosts()
    }
  }, [])

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      const res = await fetch(`/api/v1/user/${userIdToDelete}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
      }
    } catch (error) {
      console.log(error.message)
    }
    setUserIdToDelete(null)
  }
  console.log(userIdToDelete, "post id to delete -------------------------")

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(`/api/v1/user/?startIndex=${startIndex}`, {
        method: "GET",
      })
      const responseJSON = await res.json()
      if (res.ok) {
        setUsers((prev) => [...prev, ...responseJSON.data.users])
        if (responseJSON.data.users.length < 9) {
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
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.role === roles.ADMIN && users.length > 0 ? (
        <>
          <Table
            hoverable
            className="shadow-md rounded-lg"
          >
            <TableHead>
              <TableHeadCell>User Since</TableHeadCell>
              <TableHeadCell>Profile</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Role</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {users.map((user) => (
              // divide-y is used to add some spacing between the rows
              <TableBody
                className="divide-y"
                key={user._id}
              >
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {new Date(user.createdAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    {/* <Link to={`/post/${post.slug}`}> */}
                    <img
                      src={user.imgUrl}
                      alt={user.username}
                      className="h-8 rounded-full object-cover bg-gray-500"
                    />
                    {/* </Link> */}
                  </TableCell>
                  <TableCell className="font-bold">@{user.username}</TableCell>
                  <TableCell className="text-xs">
                    {user.role.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setUserIdToDelete(user._id)
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                  {/* <TableCell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </TableCell> */}
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
                onClick={handleDeleteUser}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal(false)
                  setUserIdToDelete(null)
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

export default DashboardUsers
