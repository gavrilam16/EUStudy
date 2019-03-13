import { combineReducers } from "redux";

import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import countryReducer from "./countryReducer";

// Create rootReducer
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  country: countryReducer
});
