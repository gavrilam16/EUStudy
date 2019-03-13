import { GET_COUNTRIES, ADD_COUNTRY, MODIFY_COUNTRY, DELETE_COUNTRY, COUNTRIES_FETCHING } from "../actions/types";

const initialState = {
  countries: [],
  isFetching: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
        isFetching: false
      };
    case ADD_COUNTRY:
      return {
        ...state,
        countries: [...state.countries, action.payload],
        isFetching: true
      };
    case MODIFY_COUNTRY:
      return {
        ...state,
        countries: state.countries.map(country =>
          country._id === action.payload._id ? { ...state.countries, country: action.payload } : state.countries
        ),
        isFetching: true
      };
    case DELETE_COUNTRY:
      return {
        ...state,
        countries: state.countries.filter(country => country._id !== action.payload),
        isFetching: true
      };
    case COUNTRIES_FETCHING:
      return {
        ...state,
        isFetching: true
      };
    default:
      return state;
  }
}
