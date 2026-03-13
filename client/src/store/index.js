import {configureStore} from "@reduxjs/toolkit"
import counterReducer from "./slices/counter"
const store = configureStore({
    reducer:{
        counter:counterReducer
    }
})
export default store;