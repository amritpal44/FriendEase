import React from 'react';
import HobbiesList from './HobbiesList';

const UserCard = ({ user, onSendRequest, isPending }) => {


  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-md flex flex-col items-center w-[80%]  lg:w-[45%]">
      <div className='flex justify-around items-center w-full'>
        <img 
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.userName[0]} ${user.userName[1]}`} 
          alt={`profile-${user.userName}`} 
          className="aspect-square w-20 rounded-full object-cover mb-4"
        />
        <h3 className="text-lg font-semibold">{user.userName}</h3>
      </div>

      <div className='flex justify-between items-center w-full'>
        <div className='w-3/6'>
          <p className="text-md font-serif">{user.bio}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <HobbiesList hobbies={user.hobbies}/>
          </div>
        </div>

        <div className='w-2/6'>
          <button 
            onClick={onSendRequest}
            className={`mt-4 px-4 py-2 rounded-md ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
            disabled={isPending} // Disable button if request is pending
          >
            {isPending ? 'Pending' : 'Connect'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserCard;
