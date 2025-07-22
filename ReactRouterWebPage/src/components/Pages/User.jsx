import { useEffect, useState } from "react"
import { useLoaderData } from "react-router-dom"


export default function User () {

    const [data, setData] = useState([])

    useEffect(()=> {
        fetch("https://api.github.com/users/ssandyy")
        .then((res) => res.json()) // string converted to json
        .then(data => setData(data))
    },[])

    //Or  using useLoader and creating async-await function externally and importing in main.js

    const gitData = useLoaderData()
    

    // const {userid} = useParams()   // use for url entry of data  e.g: http://localhost:5173/user/100 or http://localhost:5173/user/ssandyy


  return (
    <div className="text-3xl bg-gray-500 text-white text-center p-4">
        <img className="inline-block center" src={data.avatar_url} alt="avt" width= {200} />
       <h3> User: {gitData.name} </h3> 
       <p>Repository: {data.public_repos}</p>
    </div>
  )
}


export const githubInfoLoader = async() => {
    const response = await
        fetch("https://api.github.com/users/ssandyy")
        return response.json()
   
}