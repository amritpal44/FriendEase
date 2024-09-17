import React, { useEffect, useState } from 'react'
import logo from "../../assests/logo.png"
import { Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { apiConnector } from '../../services/apiconnector'
import { friendshipEndpoints } from '../../services/apis'
import { FaBell } from "react-icons/fa";

const Navbar = () => {

  //fetching slice data using useSelector hook
  const {token} = useSelector( (state) => state.auth );
  const navigate = useNavigate();

  const [pendingRequests, setPendingRequests] = useState(0);
  useEffect(() => {
    if (token) {
      fetchPendingRequests();
    }
  }, [token]);

  const fetchPendingRequests = async () => {
    try {
      const response = await apiConnector("POST", friendshipEndpoints.GET_FRIEND_REQUEST, {});
      if (response.data.success) {
        setPendingRequests(response.data.friendRequests.length);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };


  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    localStorage.clear();
  
    toast.success("Logged Out");
  
    setTimeout(() => {
      navigate("/signin");
      window.location.reload();
    }, 800);
  };
  


  return (
    <div id='#navbar' className='z-20 bg-slate-950 font-clarity-city  px-0 p-1 sm:p-2 md:px-7 sm:px-3'>
      <div className='flex justify-between max-w-5xl mx-auto'>
        <Link to={"/"}>
          <div className='flex items-center justify-center text-slate-200 text-2xl sm:text-3xl md:text-4xl gap-1 p-3'>
            <img src={logo} alt='friendease logo' className=" w-5 sm:w-6 md:w-9   max-w-[45px]" />

            <h1 className='-translate-x-[6px]'>riendEase</h1>
          </div>
        </Link>


        <div className='flex gap-2 sm:gap-4 p-2'>
        
          {token === null && (
            <Link to="/signin">
              <button className=" bg-[#3d65ff] text-slate-200  md:text-lg font-medium  rounded-full px-[11px] sm:px-[22px] py-2 text-richblack-100 hover:-translate-y-[2px] ease-linear duration-200">
                Sign in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="bg-transparent font-medium  md:text-lg  text-slate-200 border border-slate-200 rounded-full px-[10px] sm:px-[22px] py-2 cursor-pointer hover:-translate-y-[2px] hover:bg-slate-200 hover:text-slate-950 ease-linear duration-200">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && (
            <div className='flex items-center gap-7'>
              <Link to={"/manageRequest"} className='relative text-yellow-400 translate-y-1'>
                <FaBell className='size-6'/>
                {
                  pendingRequests > 0 && (
                    <span className='absolute -translate-y-9 translate-x-5 text-sm text-white '>
                      {pendingRequests}
                    </span>
                  )
                }
              </Link>
              <button onClick={logout} className="bg-transparent font-medium  md:text-lg  text-red-500 border border-red-700 rounded-full px-[10px] sm:px-[22px] py-2 cursor-pointer hover:-translate-y-[2px] hover:bg-red-600 hover:text-slate-200 ease-linear duration-200">
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Navbar