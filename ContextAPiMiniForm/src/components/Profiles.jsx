import { useContext } from "react"
import UserContext from "../context/UserContext"

const Profiles = () => {
    const {user} = useContext(UserContext)  // fetching user from UserContextProvider 
    
    if (!user) return <div> Please Login..!</div>
    
    return <div>Welcome {user.userName}</div>
}

export default Profiles