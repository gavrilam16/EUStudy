import { combineReducers } from "redux";

import userReducer from "./userReducer";
import countryReducer from "./countryReducer";
import universityReducer from "./universityReducer";
import errorReducer from "./errorReducer";

// Create rootReducer
export default combineReducers({
  user: userReducer,
  country: countryReducer,
  university: universityReducer,
  errors: errorReducer
});
