import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_USERS,
  SET_CURRENT_USER,
  USERS_FETCHING,
  MODIFY_USER,
  DELETE_USER,
  GET_ERRORS
} from "./types";

// Get users
export const getUsers = () => dispatch => {
  dispatch(setUsersFetching());
  axios.get("/api/users").then(res =>
    dispatch({
      type: GET_USERS,
      payload: res.data
    })
  );
};

// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => dispatch(loginUser(userData)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User fetching
export const setUsersFetching = () => {
  return {
    type: USERS_FETCHING
  };
};

// Log out user
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object, which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Modify user
export const modifyUser = user => dispatch => {
  axios.put(`/api/users/${user.id}`, user).then(res =>
    dispatch({
      type: MODIFY_USER,
      payload: res.data
    })
  );
};

// Delete user
export const deleteUser = id => dispatch => {
  axios.delete(`/api/users/${id}`).then(res =>
    dispatch({
      type: DELETE_USER,
      payload: id
    })
  );
};
