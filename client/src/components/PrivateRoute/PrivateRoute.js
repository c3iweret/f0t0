import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, reducer, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      props.isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);
PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
});
export default connect(mapStateToProps)(PrivateRoute);
