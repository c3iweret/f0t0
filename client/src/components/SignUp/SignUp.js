import React, { Component } from "react";
import "../SignUp/SignUp.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../store/actions";
import PropTypes from "prop-types";
import logo from "../../assets/images/logoBlack.png";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      allFields: "All fields are required for sign up!",
      alreadyExists: "Account with that email already exists!",
    };
  }

  componentWillReceiveProps(nextProps) {
    //if user is successfully registered, redirect to timeline
    if (nextProps.isAuthenticated) {
      this.props.history.push("/timeline");
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.history.push("/timeline");
    }
  }

  handleChange = (event, key) => {
    this.setState({ [key]: event.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };
    this.props.registerUser(body);
  };
  render() {
    return (
      <div>
        <div className="App">
          <div className="auth-wrapper">
            <img className="logo-black" src={logo} alt="logo" />
            <div className="auth-inner">
              {this.props.error &&
                this.props.error === this.state.alreadyExists && (
                  <p className="alreadyExists">
                    {this.props.error + " "}
                    <a href="/">sign in?</a>
                  </p>
                )}
              {this.props.error &&
                this.props.error === this.state.allFields && (
                  <p className="alreadyExists">{this.props.error}</p>
                )}
              <form onSubmit={this.handleSubmit}>
                <h3>Sign Up</h3>

                <div className="form-group">
                  <label>First name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => this.handleChange(e, "firstName")}
                    value={this.state.firstName}
                  />
                </div>

                <div className="form-group">
                  <label>Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={(e) => this.handleChange(e, "lastName")}
                    value={this.state.lastName}
                  />
                </div>

                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={(e) => this.handleChange(e, "email")}
                    value={this.state.email}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => this.handleChange(e, "password")}
                    value={this.state.password}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Sign Up
                </button>

                <p className="forgot-password text-right">
                  Already registered{" "}
                  <a href="/" className="bottom-link">
                    sign in?
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.error,
  error: state.error,
});

SignUp.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  registerUser: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, { registerUser })(SignUp));
