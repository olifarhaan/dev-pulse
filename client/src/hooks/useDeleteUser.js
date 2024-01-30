// useSignout.js
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice.js" // Replace with your actual action

const useDeleteUser = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/v1/user/${currentUser._id}`, {
        method: "DELETE",
      })
      const responseJSON = await res.json()
      if (!res.ok) {
        dispatch(deleteUserFailure(responseJSON.message))
      } else {
        dispatch(deleteUserSuccess(responseJSON.message))
      }
    } catch (error) {
      console.log("fifth--------")
      dispatch(deleteUserFailure(error.message))
    }
  }

  return handleUserDelete
}

export default useDeleteUser
