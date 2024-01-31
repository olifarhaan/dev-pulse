import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashboardSidebar from "../components/DashboardSidebar"
import Profile from "../components/Profile"
import DashboardPosts from "../components/DashboardPosts"
import DashboardUsers from "../components/DashboardUsers"
import Dashboardcomments from "../components/DashboardComments"

export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")
    if (tabFromUrl) setTab(tabFromUrl)
    else setTab("profile")
  }, [location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <DashboardSidebar activeTab={tab} />
      </div>
      <div className="flex-1">
        {tab === "profile" && <Profile />}
        {tab === "posts" && <DashboardPosts />}
        {tab === "users" && <DashboardUsers />}
        {tab === "comments" && <Dashboardcomments />}
      </div>
    </div>
  )
}
