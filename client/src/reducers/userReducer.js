import { GET_USERS, SET_CURRENT_USER, USERS_FETCHING } from "../actions/types";

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
    default:
      return state;
  }
}
