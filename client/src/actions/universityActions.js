import axios from "axios";
import {
  GET_UNIVERSITIES,
  ADD_UNIVERSITY,
  MODIFY_UNIVERSITY,
  DELETE_UNIVERSITY,
  UNIVERSITIES_FETCHING,
  GET_ERRORS
} from "./types";

// Get universities
export const getUniversities = () => dispatch => {
  dispatch(setUniversitiesFetching());
  axios.get("/api/universities").then(res =>
    dispatch({
      type: GET_UNIVERSITIES,
      payload: res.data
    })
  );
};

// Add university
export const addUniversity = university => dispatch => {
  axios
    .post("/api/universities", university)
    .then(res =>
      dispatch({
        type: ADD_UNIVERSITY,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Modify university
export const modifyUniversity = university => dispatch => {
  axios.put(`/api/universities/${university.id}`, university).then(res =>
    dispatch({
      type: MODIFY_UNIVERSITY,
      payload: res.data
    })
  );
};

// Delete university
export const deleteUniversity = id => dispatch => {
  axios.delete(`/api/university/${id}`).then(res =>
    dispatch({
      type: DELETE_UNIVERSITY,
      payload: id
    })
  );
};

// Universities fetching
export const setUniversitiesFetching = () => {
  return {
    type: UNIVERSITIES_FETCHING
  };
};
