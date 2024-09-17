import React, { useState } from 'react'
import { authEndpoints } from '../services/apis';
import { apiConnector } from '../services/apiconnector';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, setToken } from '../slices/authSlice';
import { setUser } from '../slices/profileSlice';


const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    })
    const {userName, password} = formData;
  
    const handleOnChange = (event) => {
      // console.log("formData", formData);
      setFormData( (prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value 
      }))
    }
  
    const handleOnSubmit = async (event) => {
      event.preventDefault();

      dispatch(setLoading(true))
      try {

        const response = await apiConnector("POST", authEndpoints.LOGIN_API, formData);

        if(!response.data.success){
            throw new Error(response);
        }

        
        dispatch(setToken(response.data.token));
        
        //setting up user image only on front end
        const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.userName[0]} ${response.data.user.userName[1]}`;        
        response.data.user.image = userImage;
        dispatch(setUser(response.data.user));

        //console.log("updated response with image", response.data);
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify( response.data.user));
        
        toast.success("Signin Successfull");
      
        navigate("/");

      } catch (error) {
        console.log("Error in signin", error);
        toast.error(error?.response?.data?.message);
      }
      dispatch(setLoading(false));
    }
  
  
    return (
      <div className='flex flex-wrap h-screen sm:h-full flex-col pt-6 p-4 gap-2 w-full bg-[#0d192b]'>
  
      
        <div className='px-4 sm:px-8 py-8 sm:py-10 flex  flex-col flex-wrap bg-[#f3f8ff] max-w-xl sm:max-w-xl mt-8 rounded-3xl gap-2 mx-auto'>
          <h1 className='text-2xl sm:text-4xl font-bold p-2'>
            Sign In
          </h1>
          <p className='text-sm sm:text-base p-2'>
            Join our community and connect with friends through shared interests and mutual connections!
          </p>
      
          <form onSubmit={handleOnSubmit} className='font-semibold mt-4 text-sm sm:text-base flex flex-col gap-4 p-2'>
            <div>
              <label className='block'>
                <p>User Name</p>
                <input type='text' name='userName' value={userName} placeholder='Enter your user name' onChange={handleOnChange} className='w-full px-4 py-2 rounded-md shadow-md'></input>
              </label>
            </div>
      
            <div>
              <label className='block'>
                <p>Password</p>
                <input type='password' name='password' value={password} onChange={handleOnChange} className='w-full px-4 py-2 rounded-md shadow-md'></input>
              </label>
            </div>
      
            <button type='submit' className='bg-[#3d65ff] rounded-lg sm:rounded-full text-slate-200 font-medium text-lg p-4 
            cursor-pointer hover:-translate-y-1 ease-linear duration-200 m-2'>
              Sign in
            </button>
          </form>
      
        </div>
      </div>
    
    )
}

export default Signin