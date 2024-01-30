import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Projects from "./pages/Projects"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoutes/PrivateRoute"
import OnlyAuthor from "./components/PrivateRoutes/OnlyAuthor"
import CreatePost from "./pages/CreatePost"
import OnlyAdmin from "./components/PrivateRoutes/OnlyAdmin"
import Admin from "./pages/Admin"
import Post from "./pages/Post"
import UpdatePost from "./pages/UpdatePost"
import ScrollToTop from "./components/ScrollToTop"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/projects"
            element={<Projects />}
          />
          <Route
            path="/sign-in"
            element={<SignIn />}
          />
          <Route
            path="/sign-up"
            element={<SignUp />}
          />

          <Route
            path="/post/:postSlug"
            element={<Post />}
          />

          {/* For all logged in users */}
          <Route
            path="/"
            element={<PrivateRoute />}
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
          </Route>

          {/* Only for Authors & Admins */}
          <Route
            path="/"
            element={<OnlyAuthor />}
          >
            <Route
              path="/create-post"
              element={<CreatePost />}
            />
            <Route
              path="/update-post/:postId"
              element={<UpdatePost />}
            />
          </Route>

          {/* Only for Admins*/}
          <Route
            path="/"
            element={<OnlyAdmin />}
          >
            <Route
              path="/admin"
              element={<Admin />}
            />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
