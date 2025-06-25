import { configureStore } from 'react-redux'
import todoReducer from '../feature/todo/todoSlice'


export const store = configureStore({
    reducer: todoReducer
})