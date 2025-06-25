import { createSlice, nanoid } from 'react-redux'


const initialState = {
    todo: [{
        id: 1,
        text: "Hello World"
    },

]
}

export const todoSlice = createSlice({
    name:'todo',
    initialState,
    // reducer
    reducers: {
        addTodo: (state, action) => {
            const todo  = {
                id: nanoid(),
                text: action.payload
            }
            state.todos.push(todo) //dynamic for text input 
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload)
        }  
    }
})

//export all reducer component 
export const { addTodo, removeTodo } = todoSlice.actions

//export reducer and pass in store/configureStore()
export default todoSlice.reducers
