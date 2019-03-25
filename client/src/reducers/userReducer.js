import {
  GET_USERS,
  SET_CURRENT_USER,
  MODIFY_USER,
  DELETE_USER,
  USERS_FETCHING
} from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  users: [],
  currentUser: {},
  isFetching: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        isFetching: false
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        currentUser: action.payload
      };
    case USERS_FETCHING:
      return {
        ...state,
        isFetching: true
      };
    case MODIFY_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id
            ? { ...state.users, user: action.payload }
            : state.users
        ),
        isFetching: true
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload),
        isFetching: true
      };
    default:
      return state;
  }
}
