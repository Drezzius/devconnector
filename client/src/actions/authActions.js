import axios from 'axios'
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode'
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(error => dispatch({
        type: GET_ERRORS,
        payload: error.response.data
    })
    )
}

// Login - Get User Token
export const loginUser = (userData) => dispatch => {
    axios.post('/api/users/login', userData)
    .then(res => {
        // Save to local storage
        const { token } = res.data
        // Set token to ls
        localStorage.setItem('jwtToken', token)
        // Set token to Auth header
        setAuthToken(token)
        // Decode token to get user data
        const decoded = jwt_decode(token)
        // Set current user
        dispatch(setCurrentUser(decoded))
    }).catch(err => {
        const error = JSON.parse(err.request.response);
        dispatch({
            type: GET_ERRORS,
            payload: error,
        })
    })
}

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem('jwtToken')
    // Remove auth header for future requests
    setAuthToken(false)
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}))
}