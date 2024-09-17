import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiconnector';
import { friendshipEndpoints, recommendationEndpoints } from '../../services/apis';
import { setLoading } from '../../slices/authSlice';
import { ClipLoader } from 'react-spinners';
import UserCard from './UserCard';

const UserFeed = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]); // Track pending friend requests

  // Access loading state, current user, and search results from Redux
  const { loading } = useSelector((state) => state.auth);
  const { user: currentUser } = useSelector((state) => state.profile);
  const { results: searchResults } = useSelector((state) => state.search); // Access search results

  // Fetch random users if there are no search results
  const fetchUsers = async (page) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", recommendationEndpoints.GET_RANDOM_USERS, { page: page });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
    dispatch(setLoading(false));
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await apiConnector("POST", friendshipEndpoints.SEND_FRIEND_REQUEST, { friendId: userId });
      if (response.data.success) {
        toast.success('Friend request sent');
        setPendingRequests([...pendingRequests, userId]); // Add user to pending list
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.log('Error sending friend request:', error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    // Only fetch random users if no search results exist
    if (searchResults.length === 0) {
      fetchUsers(currentPage);
    } else {
      // If there are search results, use them
      setUsers(searchResults);
      setTotalPages(1); // Set totalPages to 1 since search results don't need pagination
    }
  }, [currentPage, searchResults]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className=" py-8 flex flex-col items-center">
      {loading ? (
        <div className='flex flex-wrap justify-center h-full w-full items-center max-w-[1000px]'>
          <ClipLoader size={50} />
        </div>
      ) : (
        <>
          <h1 className="text-white text-2xl mb-4">User Feed</h1>

          <div className="flex flex-wrap gap-4 justify-center">
            {users.length > 0 ? (
              users
                .filter((user) => user._id !== currentUser._id)
                .map(user => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onSendRequest={() => sendFriendRequest(user._id)}
                    isPending={pendingRequests.includes(user._id)} // Pass pending state
                  />
                ))
            ) : (
              <p className="text-white">No users to display</p>
            )}
          </div>

          <div className="mt-6">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-white text-blue-500 rounded-md mr-2"
              >
                Previous
              </button>
            )}
            {currentPage < totalPages && searchResults.length === 0 && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-white text-blue-500 rounded-md"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserFeed;
