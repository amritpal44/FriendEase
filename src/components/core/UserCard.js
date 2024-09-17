import React from 'react';

const UserCard = ({ user, onSendRequest, isPending }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-md flex flex-col items-center w-60">
      <img 
        src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.userName[0]} ${user.userName[1]}`} 
        alt={`profile-${user.userName}`} 
        className="aspect-square w-20 rounded-full object-cover mb-4"
      />
      <h3 className="text-lg font-semibold">{user.userName}</h3>
      <p className="text-sm">{user.bio}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {user.hobbies.map(hobby => (
          <span key={hobby._id} className="text-xs px-2 py-1 bg-gray-200 rounded-md">
            {hobby.hobby}
          </span>
        ))}
      </div>
      <button 
        onClick={onSendRequest}
        className={`mt-4 px-4 py-2 rounded-md ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        disabled={isPending} // Disable button if request is pending
      >
        {isPending ? 'Pending' : 'Send Friend Request'}
      </button>
    </div>
  );
};

export default UserCard;
