import axios from "axios";
import {
  GET_COUNTRIES,
  ADD_COUNTRY,
  MODIFY_COUNTRY,
  DELETE_COUNTRY,
  COUNTRIES_FETCHING
} from "./types";

// Get countries
export const getCountries = () => dispatch => {
  dispatch(setCountriesFetching());
  axios.get("/api/countries").then(res =>
    dispatch({
      type: GET_COUNTRIES,
      payload: res.data
    })
  );
};

// Add country
export const addCountry = country => dispatch => {
  dispatch(setCountriesFetching());
  axios
    .post("/api/countries", country)
    .then(res =>
      dispatch({
        type: ADD_COUNTRY,
        payload: res.data
      })
    )
    .then(() => dispatch(getCountries()));
};

// Modify country
export const modifyCountry = country => dispatch => {
  dispatch(setCountriesFetching());
  axios
    .put(`/api/countries/${country.id}`, country)
    .then(res =>
      dispatch({
        type: MODIFY_COUNTRY,
        payload: res.data
      })
    )
    .then(() => dispatch(getCountries()));
};

// Delete country
export const deleteCountry = id => dispatch => {
  dispatch(setCountriesFetching());
  axios
    .delete(`/api/countries/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_COUNTRY,
        payload: id
      })
    )
    .then(() => dispatch(getCountries()));
};

// Countries fetching
export const setCountriesFetching = () => {
  return {
    type: COUNTRIES_FETCHING
  };
};
