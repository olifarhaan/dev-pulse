import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react"
import { CiUser } from "react-icons/ci"
import { HiOutlineUserGroup, HiAnnotation } from "react-icons/hi"
import { IoDocumentTextOutline } from "react-icons/io5"
import { PiSignOut } from "react-icons/pi"
import { Link } from "react-router-dom"
import useSignout from "../hooks/useSignout"
import { useSelector } from "react-redux"
import { roles } from "../utils/constants"

const DashboardSidebar = ({ activeTab }) => {
  const handleSignout = useSignout()
  const { currentUser } = useSelector((state) => state.user)

  return (
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard/?tab=profile">
            <SidebarItem
              icon={CiUser}
              label={currentUser.role}
              labelColor="dark"
              as="div"
              active={activeTab === "profile"}
            >
              Profile
            </SidebarItem>
          </Link>

          {(currentUser.role === roles.ADMIN ||
            currentUser.role === roles.AUTHOR) && (
            <>
              <Link to="/dashboard/?tab=posts">
                <SidebarItem
                  icon={IoDocumentTextOutline}
                  labelColor="dark"
                  as="div"
                  active={activeTab === "posts"}
                >
                  Posts
                </SidebarItem>
              </Link>
              {currentUser.role === roles.ADMIN && (
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    active={activeTab === "users"}
                    icon={HiOutlineUserGroup}
                    as="div"
                  >
                    Users
                  </Sidebar.Item>
                </Link>
              )}
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={activeTab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem
            href={"/"}
            icon={PiSignOut}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}

export default DashboardSidebar
