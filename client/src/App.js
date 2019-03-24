import React, { Component } from "react";

import AppNavbar from "./components/AppNavbar";
import MainPage from "./components/MainPage";
import Affiliate from "./components/users/Affiliate";
import Register from "./components/users/Register";
import Login from "./components/users/Login";
import PrivateRoute from "./components/users/PrivateRoute";
import ProfilePage from "./components/users/ProfilePage";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Provider } from "react-redux";
import store from "./store";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/userActions";

import "./App.css";

class App extends Component {
  render() {
    // Check for token to keep user logged in
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      setAuthToken(token);
      // Decode token and get user info and exp
      const decoded = jwt_decode(token);
      // Set user and isAuthenticated
      store.dispatch(setCurrentUser(decoded));
      // Check for expired token
      const currentTime = Date.now() / 1000; // to get in milliseconds
      if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        // Redirect to login
        window.location.href = "./login";
      }
    }

    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <AppNavbar/>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/affiliate" component={Affiliate} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/profile" component={ProfilePage} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
