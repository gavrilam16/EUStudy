import { SET_CURRENT_USER, USER_FETCHING } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  isFetching: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_FETCHING:
      return {
        ...state,
        isFetching: true
      };
    default:
      return state;
  }
}
