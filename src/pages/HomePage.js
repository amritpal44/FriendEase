import React from 'react'
import Navbar from '../components/common/Navbar'
import { useSelector } from 'react-redux'
import HobbiesList from '../components/core/HobbiesList';
import UserFeed from '../components/core/UserFeed';
import FriendsList from '../components/core/FriendList';

const HomePage = () => {

  const {user} = useSelector( (state) => state.profile);
  const {token} = useSelector( (state) => state.auth);


  return (
    <div className='bg-[#0d192b] h-full flex-col overflow-y-scroll'>
      <Navbar/>
     
      {
        token ? (

          <div id='container' className='flex flex-col sm:flex-row max-w-6xl mx-auto justify-around mt-10'>

            <div id='user-info' className='border-slate-200 hidden rounded-md md:block'>
              <div className="flex flex-col justify-center  items-center gap-4 text-slate-200 max-w-52 border-slate-200 border-[1px] px-4 py-6 rounded-md">
                <img src={user.image} alt={`profile-${user?.userName}`}
                  className="aspect-square w-[60px]  rounded-full object-cover"
                />
                <p className="text-lg font-semibold">
                  {user?.userName}
                </p>

                <div className="space-y-1 flex flex-col gap-2">
                  <div className='flex flex-col'>
                    <h4>Bio:</h4>
                    <p className="text-sm"> {user?.bio}</p>
                  </div>
                  <div className='flex flex-col'>
                    <h4>Hobbies:</h4>
                    <HobbiesList hobbies={user?.hobbies}/>
                  </div>
                  <div className='flex justify-between'>
                    <h4>Friends: </h4>
                    <p className='pr-1'>{user.friends.length}</p>
                  </div>
                </div>
              </div>
            </div>


            <div id='user-feed' className='w-full lg:w-4/6'>
              <UserFeed/>
            </div>

            <div id='friends-list'>
              <FriendsList/>
            </div>
          </div>
        ):(<div className='flex h-3/4 justify-center items-center text-red-600'>
          <h1 className='text-2xl'>You need to Signin first</h1>
        </div>)
      }
      
    </div>
  )
}

export default HomePage