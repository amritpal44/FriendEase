import { combineReducers } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice';
import profileslice from '../slices/profileSlice';


const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileslice
})

export default rootReducer;