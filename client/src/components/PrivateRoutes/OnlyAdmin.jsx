import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { roles } from "../../utils/constants"

const OnlyAdmin = () => {
  const { currentUser } = useSelector((state) => state.user)

  return currentUser && currentUser.role === roles.ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  )
}

export default OnlyAdmin
