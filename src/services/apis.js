const BASE_URL = process.env.REACT_APP_BASE_URL


export const authEndpoints = {
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/signin",
}


export const friendshipEndpoints = {
    SEND_FRIEND_REQUEST: BASE_URL + "/friendship/sendFriendRequest",
    ACCEPT_FRIEND_REQUEST: BASE_URL + "/friendship/acceptFriendRequest",
    REJECT_FRIEND_REQUEST: BASE_URL + "/friendship/rejectFriendRequest",
    REMOVE_FRIEND: BASE_URL + "/friendship/removeFriend",
    GET_FRIEND_REQUEST: BASE_URL + "/friendship/getFriendRequests",
    GET_FRIENDSD: BASE_URL + "/friendship/getFriends"
}


export const searchEndpoints = {
    SEARCH_USER: BASE_URL + "/search/searchUsers"
}

export const recommendationEndpoints = {
    GET_RANDOM_USERS: BASE_URL + "/recommendation/getRandomUsers"
}