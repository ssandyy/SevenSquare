import { useState } from "react"
import { useTodo } from "../contexts/TodoContext"

const TodoForm = () => {
    const [todo, setTodo] = useState("")
    const {addTodo} = useTodo()  // calling from context ->TodoContext.js


    const add = (e) => {
        e.preventDefault();
        addTodo({todo, completed:false}) // addTodo({id: Date.now(), todo: todo, completed: false}) 
        //as if field and valuse variable is same we can call using field name 

        setTodo("")//form clean 
    }

  return (
     <form onSubmit={add} className="flex">
            <input
                type="text"
                placeholder="Write Todo..."
                className="w-full border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
                
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <button type="submit" className="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0">
                Add
            </button>
        </form>
  )
}

export default TodoForm