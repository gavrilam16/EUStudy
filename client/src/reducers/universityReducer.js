import {
  GET_UNIVERSITIES,
  ADD_UNIVERSITY,
  MODIFY_UNIVERSITY,
  DELETE_UNIVERSITY,
  UNIVERSITIES_FETCHING
} from "../actions/types";

const initialState = {
  universities: [],
  isFetching: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_UNIVERSITIES:
      return {
        ...state,
        universities: action.payload,
        isFetching: false
      };
    case ADD_UNIVERSITY:
      return {
        ...state,
        universities: [...state.universities, action.payload],
        isFetching: true
      };
    case MODIFY_UNIVERSITY:
      return {
        ...state,
        universities: state.universities.map(university =>
          university._id === action.payload._id
            ? { ...state.universities, university: action.payload }
            : state.universities
        ),
        isFetching: true
      };
    case DELETE_UNIVERSITY:
      return {
        ...state,
        universities: state.universities.filter(
          university => university._id !== action.payload
        ),
        isFetching: true
      };
    case UNIVERSITIES_FETCHING:
      return {
        ...state,
        isFetching: true
      };
    default:
      return state;
  }
}
