import React from "react";
import Form from "./commons/form";
import Joi from "joi-browser";
import auth from "../services/authService";
import * as uesrService from "./../services/userService";

class RegisterForm extends Form {
  state = { data: { username: "", password: "", name: "" }, errors: {} };

  schema = {
    username: Joi.string()
      .email()
      .label("Username")
      .required(),
    password: Joi.string()
      .min(5) //regex(/^[a-zA-Z0-9]{5,10}$/)
      .label("Password"),
    name: Joi.string()
      .label("Name")
      .required()
  };
  async doSubmit() {
    try {
      const response = await uesrService.register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      //this.props.history.push("/");
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  }
  render() {
    return (
      <div className="container">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username", "email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
