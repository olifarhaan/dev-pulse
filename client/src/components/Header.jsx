import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  TextInput,
} from "flowbite-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { SiMicrodotblog } from "react-icons/si"
import { CiSearch, CiUser } from "react-icons/ci"
import { PiSignOut } from "react-icons/pi"

import { FaMoon, FaSun } from "react-icons/fa"
import { customFormFields } from "../assets/customThemes.js"
import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../redux/theme/themeSlice.js"
import useSignout from "../hooks/useSignout.js"

const Header = () => {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { theme } = useSelector((state) => state.theme)
  const location = useLocation()
  const handleSignout = useSignout()
  const checkPath = (path) => {
    return location.pathname === path
  }
  const navigate = useNavigate()

  const navData = [
    {
      id: 1,
      text: "Home",
      link: "/",
    },
    {
      id: 2,
      text: "Projects",
      link: "/projects",
    },
    {
      id: 3,
      text: "About",
      link: "/about",
    },
    {
      id: 4,
      text: "Blogs",
      link: "/blogs",
    },
  ]

  return (
    <Navbar className="border-b-[1px] flex items-center justify-between">
      {/* Primary */}
      <div className="flex items-center gap-0 sm:gap-16">
        {/* Logo */}
        <Link
          className="flex justify-center items-center gap-2 text-lg sm:text-xl"
          to="/"
        >
          <SiMicrodotblog className="text-accentBlue" />
          <span className="font-bold">Dev Pulse</span>
        </Link>

        {/* Primary Menu */}
        <div></div>
      </div>

      {/* Secondary Menu */}
      <div className="flex gap-2 items-center md:order-2 justify-end">
        <form className="">
          <TextInput
            theme={customFormFields}
            type="text"
            name="search"
            placeholder="Search..."
            rightIcon={CiSearch}
            className="hidden lg:inline"
            style={{ height: "40px", borderColor: "#E5E7EB" }}
          />
        </form>
        <Button
          className="w-10 h-10 lg:hidden"
          color="gray"
          style={{ color: "#6B7280" }}
        >
          <CiSearch className="text-lg" />
        </Button>
        <Button
          className="w-10"
          color="gray"
          style={{ height: "40px" }}
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaMoon className="text-lg text-gray-500" />
          ) : (
            <FaSun className="text-lg text-gray-500" />
          )}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <img
                src={currentUser.imgUrl}
                className="w-10 h-10 object-cover rounded-md border border-[#E5E7EB]"
              ></img>
            }
          >
            <DropdownHeader>
              <span className="font-bold">@{currentUser.username}</span>
            </DropdownHeader>
            <Link to="/dashboard/?tab=profile">
              <DropdownItem>
                {" "}
                <CiUser className="text-lg mr-1 "></CiUser> <span>Profile</span>
              </DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>
              {" "}
              <PiSignOut className="text-lg mr-1 " /> <span>Sign Out</span>
            </DropdownItem>
          </Dropdown>
        ) : (
          <button
            className="h-10 px-5 bg-accentOrange hover:bg-accentBlue rounded-lg text-white text-md transition duration-500 ease-in-out"
            onClick={navigate("/sign-in")}
          >
            Sign In
          </button>
        )}

        <Navbar.Toggle />
      </div>
      {/* <div> */}
      <Navbar.Collapse>
        {navData.map((data) => (
          <Navbar.Link
            id={data.id}
            key={data.id}
            as="div"
          >
            <Link
              to={data.link}
              className="hover:text-accentOrange transition duration-500 ease-in-out"
            >
              {data.text}
            </Link>
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
      {/* </div> */}
    </Navbar>
  )
}

export default Header
