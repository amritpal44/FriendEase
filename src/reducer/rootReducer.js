import { combineReducers } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice';
import profileslice from '../slices/profileSlice';
import searchSlice from '../slices/searchSlice';


const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileslice,
    search: searchSlice
})

export default rootReducer;