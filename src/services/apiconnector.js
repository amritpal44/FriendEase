import axios from "axios";

export const axiosInstance = axios.create({
    withCredentials: true,
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");

    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : undefined, // Add the token to headers
        },
        params: params ? params : null,
    });
};
