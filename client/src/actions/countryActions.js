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
  axios.post("/api/countries", country).then(res =>
    dispatch({
      type: ADD_COUNTRY,
      payload: res.data
    })
  );
};

// Modify country
export const modifyCountry = country => dispatch => {
  axios.put(`/api/countries/${country.id}`, country).then(res =>
    dispatch({
      type: MODIFY_COUNTRY,
      payload: res.data
    })
  );
};

// Delete country
export const deleteCountry = id => dispatch => {
  axios.delete(`/api/countries/${id}`).then(res =>
    dispatch({
      type: DELETE_COUNTRY,
      payload: id
    })
  );
};

// Countries fetching
export const setCountriesFetching = () => {
  return {
    type: COUNTRIES_FETCHING
  };
};
