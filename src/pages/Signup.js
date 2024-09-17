import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { apiConnector } from '../services/apiconnector';
import { authEndpoints } from '../services/apis';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../slices/authSlice';

const Signup = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading} = useSelector( (state) => state.auth);

  const [formData, setFormData] = useState({
    userName: "",
    bio: "",
    hobbies: "",
    password: "",
    confirmPassword: ""
  })

  const {userName, bio, hobbies, password, confirmPassword} = formData;


  const handleOnChange = (event) => {
    setFormData( (prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }))
    // console.log("formData: ", formData);
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    
    if(password !== confirmPassword){
      toast.error("Password donot match");
      console.log("password donot match");
      return
    }
    
    const hobbiesArray = hobbies.split(' ').filter(hobby => hobby.trim() !== "");
    const updatedFormData = {
      ...formData,
      hobbies: hobbiesArray
    };
    
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", authEndpoints.SIGNUP_API, updatedFormData);

      if(!response.data.success){
        throw new Error(response);
      }

      toast.success("Signup Successfull");
      
      navigate("/signin");
    } catch (error) {
      
      console.log("Error in signup: ", error);
      toast.error(error?.response?.data?.message);
    }

    dispatch(setLoading(false));

    //RESET DATA
    setFormData({
      userName: "",
      bio: "",
      hobbies: "",
      password: "",
      confirmPassword: "",
    })        
  }


  return (
    <div className='w-full h-full flex flex-col items-center pt-8 bg-[#0d192b] pb-4 sm:pb-7 overflow-y-scroll'>

      <div className='p-6 mx-4 bg-[#f3f8ff] gap-2 max-w-xl mt-4 rounded-3xl'>

        <h1 className='text-2xl sm:text-4xl font-bold p-2'>
          Sign Up
        </h1>
        <p className='text-sm sm:text-base p-2'>
          Join our community and connect with friends through shared interests and mutual connections!
        </p>


        <form onSubmit={handleOnSubmit} className='font-semibold text-sm sm:text-base flex flex-col gap-4 p-2 py-4'>
          <div className='flex flex-col sm:flex-row gap-4 '>
            <label className='flex-1'>
              <p className=''>User Name</p>
              <input type='text' name='userName' value={userName} required onChange={handleOnChange} placeholder='Enter user name' className='w-full px-4 py-2 rounded-md shadow-md'></input>
            </label>
          </div>

          <div className=''>
            <label>
              <p>Bio</p>
              <input type='text' name='bio' value={bio} required onChange={handleOnChange} placeholder='Enter something about yourself' className='w-full px-4 py-2 rounded-md shadow-md'></input>
            </label>
          </div>

          <div>
            <label>
              <p>Hobbies</p>
              <input type='text' name='hobbies' value={hobbies} required onChange={handleOnChange} placeholder='Enter hobbies space seperated' className='w-full px-4 py-2 rounded-md shadow-md'></input>
            </label>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 '>
            <label className='flex-1'>
              <p>Create Password</p>
              <input type='password' name='password' value={password} required onChange={handleOnChange} className='w-full px-4 py-2 rounded-md shadow-md'></input>
            </label>
            <label className='flex-1'>
              <p>Confirm Password</p>
              <input type='password' name='confirmPassword' value={confirmPassword} required onChange={handleOnChange} className='w-full px-4 py-2 rounded-md shadow-md'></input>
            </label>
          </div>

          <button type='submit' className='bg-[#3d65ff] rounded-full text-slate-200 font-medium text-lg px-6 py-3 cursor-pointer hover:-translate-y-1 ease-linear duration-200 mt-4'>
            {loading ? (
                <FaSpinner className='animate-spin text-white mx-auto w-full' />
            ) : (
                'Sign in'
            )}
          </button>
        </form>

      </div>
    </div>

  )
}

export default Signup