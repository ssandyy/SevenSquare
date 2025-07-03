import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthLayout, Login } from './components/index.js'
import './index.css'
import AddPost from "./pages/AddPost.jsx"
import AllPosts from "./pages/AllPost.jsx"
import EditPost from "./pages/EditPost.jsx"
import Home from './pages/Home.jsx'
import Post from "./pages/Post.jsx"
import EditProfile from './pages/Profile/EditProfile.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Signup from './pages/Profile/Signup.jsx'
import UpdatePassword from './pages/Profile/UpdatePassword.jsx'
import store from './store/store.js'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: (
                <AuthLayout authentication={false}>
                    <Login />
                </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                    <Signup />
                </AuthLayout>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <AuthLayout authentication={false}>
                    {" "}
                    <AllPosts />
                </AuthLayout>
            ),
        },
        {
            path: "/add-post",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <AddPost />
                </AuthLayout>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <EditPost />
                </AuthLayout>
            ),
        },
        {
            path: "/profile",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <h1 className="text-2xl text-center">My Profile</h1>
                    <Profile />
                </AuthLayout>
            ),
        },
        {
            path: "/edit-profile",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <EditProfile />
                </AuthLayout>
            )
        },
        {
            path: "/change-password",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <UpdatePassword />
                </AuthLayout>
            )
        },
        {
            path: "/post/:slug",
            element: <Post />,
        },
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)