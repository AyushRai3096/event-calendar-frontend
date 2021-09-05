import Calendar from "./Calendar/Calendar";
import Login from "./Login/Login";

import { initLogout } from "./store/actions";
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer,toast} from 'react-toastify'

function App(props) {
  return (
    <BrowserRouter>
    <ToastContainer/>
      <Route path="/login" exact component={Login} />
      <Route path="/calendar" exact component={Calendar} />
      <Switch>
        <Redirect from="/" exact to="/login" />
      </Switch>
    </BrowserRouter>
  );
}

const mapStateToProps = (store) => {
  return {
    isLoggedIn: store.authToken ? true : false,
    userId: store.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutHandler: (userId) => dispatch(initLogout(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
