import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { friendshipEndpoints } from '../services/apis';
import { apiConnector } from '../services/apiconnector';
import { setLoading } from '../slices/authSlice';
import Navbar from '../components/common/Navbar';

const ManageFriends = () => {
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();

  const fetchFriends = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", friendshipEndpoints.GET_FRIENDSD, {});
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error('Failed to load friends');
    }
    dispatch(setLoading(false));
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await apiConnector("POST", friendshipEndpoints.REMOVE_FRIEND, { friendId });
      toast.success('Friend removed');
      setFriends(friends.filter((friend) => friend._id !== friendId));
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error('Failed to remove friend');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <>
        <Navbar/>
        <div className="bg-[#0d192b] h-full py-8 flex flex-col items-center">
        <h1 className="text-white text-2xl mb-4">Manage Friends</h1>
        <ul className="space-y-4">
            {friends.map((friend, index) => (
            <li key={friend._id} className="flex items-center space-x-4 border-slate-200 border-[1px] rounded-md px-3 py-1 w-full justify-between">
                <div>
                  <span className="font-semibold text-slate-200">{index + 1}. </span>
                  <span className='text-slate-200 text-lg font-semibold'>{friend.userName}</span>
                </div>
                <div>
                  <button
                  onClick={() => handleRemoveFriend(friend._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                  Remove Friend
                  </button>
                </div>
            </li>
            ))}
        </ul>
        </div>
    </>
  );
};

export default ManageFriends;
