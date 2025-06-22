import React from 'react'
import { createRoot } from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from 'react-router-dom'

import { About, Contact, Home } from './components'
import User, { githubInfoLoader } from './components/Pages/User'
import './index.css'
import Layout from './Layout'



// const router = createBrowserRouter([{
//     path:'/',
//     element:<Layout />,
//     children:[
//         {
//           path: "",
//           element: <Home />
//         },
//         {
//           path:'about',
//           element: <About />
//         },
//         {
//           path: 'contact',
//           element: <Contact />
//         }
// ]
// }
// ])

// OR 
const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path='/' element={<Layout/>} >
      <Route path='' element={<Home/>} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />

      {/* <Route path='user/:userid' element={<User />} /> */}
      <Route 
        path='user' 
        element={<User />}
        loader={githubInfoLoader}
      />
    </Route>
  )
)



createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
