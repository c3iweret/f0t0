import React, { Component } from "react";
import axios from "axios";
import "../Login/Login.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updateName } from "../../store/actions";

class Login extends Component {
  constructor() {
    super();
    // Don't call this.setState() here!
    this.state = {
      email: "",
      password: "",
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const body = {
      email: this.state.email,
      password: this.state.password,
    };
    axios.post("/login", body).then(
      (response) => {
        // this.props.updateName("hello");
        console.log("name from store", this.props.name);
        console.log("login response", response);
        if (response.data.status === "Success") {
          this.props.history.push("/timeline");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    return (
      <div>
        <div className="App">
          <div className="auth-wrapper">
            <div className="auth-inner">
              <form onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>

                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={this.handleEmailChange}
                    value={this.state.email}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={this.handlePasswordChange}
                    value={this.state.password}
                  />
                </div>

                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheck1"
                    >
                      Remember me
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Submit
                </button>
                <div className="alt-suggestions">
                  <p className="forgot-password text-left">
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                  </p>
                  <p className="forgot-password text-right">
                    Forgot <a href="/">password?</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    name: state.name,
  };
};

const mapDispatchToProps = { updateName };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
