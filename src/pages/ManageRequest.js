import React, { useEffect, useState } from 'react'
import { apiConnector } from '../services/apiconnector';
import { friendshipEndpoints } from '../services/apis';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';

const ManageRequest = () => {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
      fetchFriendRequests();
    }, []);
  
    const fetchFriendRequests = async () => {
      try {
        const response = await apiConnector("POST", friendshipEndpoints.GET_FRIEND_REQUEST, {});
        if (response.data.success) {
          setFriendRequests(response.data.friendRequests);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
  
    const handleAccept = async (friendshipId) => {
      try {
        const response = await apiConnector("POST", friendshipEndpoints.ACCEPT_FRIEND_REQUEST, { friendshipId: friendshipId});

        if(response.data.success){
            toast.success("Friend request accepted!");
            fetchFriendRequests(); // Refresh the list
        }
        else{
            throw new Error(response);
        }
      } catch (error) {
        console.error("Error accepting friend request:", error);
        toast.error(error?.response?.data?.message);
      }
    };
  
    const handleReject = async (friendshipId) => {
      try {
        const response = await apiConnector("POST", friendshipEndpoints.REJECT_FRIEND_REQUEST, { friendshipId: friendshipId});
        if(response.data.success){
            toast.success("Friendship request rejected!");
            fetchFriendRequests(); // Refresh the list
        }
        else{
            throw new Error(response);
        }
      } catch (error) {
        console.error("Error rejecting friend request:", error);
        toast.error(error?.response?.data?.message);
      }
    };
  
    return (
      <div className=" mx-auto bg-[#0d192b] h-full flex flex-col">
        <div className='flex flex-col gap-7'>
            <Navbar/>
        </div>
        <h1 className="text-3xl font-bold text-blue-600 font-serif pl-10 mb-16 mt-10">Manage Friend Requests</h1>
        {friendRequests.length > 0 ? (
          friendRequests.map(request => (
            <div key={request._id} className="flex justify-between items-center mb-3 py-3 px-4 bg-gray-100 rounded-md w-2/5 max-w-2xl mx-auto">
              <span className='font-semibold text-xl '>{request.user1.userName}</span>
              <div>
                <button
                  className="mr-3 bg-green-500 text-white px-4 py-2 rounded font-semibold"
                  onClick={() => handleAccept(request._id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-slate-200 mx-auto text-2xl font-bold'>No pending friend requests.</p>
        )}
      </div>
    );
}

export default ManageRequest