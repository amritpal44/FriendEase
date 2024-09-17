import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiconnector';
import { useNavigate } from 'react-router-dom';
import { friendshipEndpoints } from '../../services/apis';
import { setLoading } from '../../slices/authSlice';
import { ClipLoader } from 'react-spinners';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch the user's friends from the backend
  const fetchFriends = async () => {
    dispatch(setLoading(true));
    setLoadingFriends(true);
    try {
      const response = await apiConnector("POST", friendshipEndpoints.GET_FRIENDSD);
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error('Failed to load friends');
    }
    setLoadingFriends(false);
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleManageFriends = () => {
    navigate('/manageFriends');
  };

  return (
    <div className="bg-[#0d192b] p-6 text-white border-slate-200 border-[1px] rounded-md">
      <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
      {loadingFriends ? (
        <ClipLoader size={50} />
      ) : (
        <>
          {friends.length > 0 ? (
            <ul className="space-y-2 px-4">
              {friends.map((friend, index) => (
                <li key={friend._id} className="flex items-center space-x-4 p-2 bg-gray-800 rounded-md">
                  <span className="font-semibold">{index + 1}. </span>
                  <img
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${friend.userName[0]} ${friend.userName[1]}`}
                    alt={`profile-${friend.userName}`}
                    className="aspect-square w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm">{friend.userName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">You have no friends yet.</p>
          )}

          <button 
            onClick={handleManageFriends} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Manage Friends
          </button>
        </>
      )}
    </div>
  );
};

export default FriendsList;