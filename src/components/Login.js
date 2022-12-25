import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";
import {
  Button,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  UncontrolledAlert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { API_USERS } from "../Global";
import { HiLink } from "react-icons/hi";
import axios from "axios";
import { LOGIN, SET_USER } from "../context/Action.type";
import { Context } from "../context/Context";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = yup.object().shape({
  email: yup.string().email().required("Required!!!"),
  password: yup.string().required("Required!!!"),
});

export default function Login() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Context);

  const getUserData = async () => {
    const result = await axios
      .get(`${API_USERS}/user`, {
        withCredentials: true,
      })
      .catch((error) => {
        setError(error.toString());
        localStorage.clear();
      });

    const data = await result.data;
    if (result.status === 200) {
      return data;
    } else {
      setError(data.message || result.statusText);
      localStorage.clear();
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const result = await axios
        .post(`${API_USERS}/login`, values)
        .catch((err) => {
          setError(err.toString());
        });

      const data = result.data;
      if (data.isSuccess === true) {
        setSuccess(data.message);
        dispatch({
          type: LOGIN,
        });
        getUserData().then((data) => {
          if (data) {
            dispatch({
              type: SET_USER,
              payload: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                isAdmin: data.isAdmin,
              },
            });
          } else {
            setError("User details not found");
            localStorage.clear();
          }
        });

        setTimeout(() => {
            navigate("/dashboard");
        }, 2000);
      } else {
        setError(data.message);
      }
    },
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", state.isLoggedIn);
    localStorage.setItem("user", JSON.stringify(state.user));
  },[state.isLoggedIn, state.user])

  return (
    <Container className="main_container_login">
      <p className="logo_text">
        {" "}
        <HiLink />
        &nbsp;URL Shrinker 😎
      </p>
      {error !== "" && (
        <UncontrolledAlert className="msg_alert_login" color="danger" fade>
          {error}
        </UncontrolledAlert>
      )}
      {success !== "" && (
        <UncontrolledAlert className="msg_alert_login" color="success" fade>
          {success}
        </UncontrolledAlert>
      )}
      <div className="login_container">
        <div className="login_section">
          <h1 className="text-center">
            <b>Login</b>
          </h1>
          <Form className="login_form" onSubmit={formik.handleSubmit}>
            <FormGroup className="mb-0">
              <Label for="email">
                <b>Email</b>
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="Your Email Address"
                type="email"
                invalid={formik.errors.email && formik.touched.email}
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <FormFeedback style={{ display: "inline" }}>
                  {formik.errors.email}
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup className="mb-0">
              <Label for="password">
                <b>Password</b>
              </Label>
              <Input
                id="password"
                name="password"
                placeholder="Your Password"
                type="password"
                invalid={formik.errors.password && formik.touched.password}
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password && (
                <FormFeedback style={{ display: "inline" }}>
                  {formik.errors.password}
                </FormFeedback>
              )}
            </FormGroup>
            <Button
              color="link"
              className="p-0 mb-3 text-start"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Button>
            <br />
            <Button type="submit" color="success" outline>
              Login
            </Button>
          </Form>
        </div>

        <div className="container register_section">
          <h3 className="mb-4">Don't have an account?</h3>
          <Button
            color="success"
            outline
            block
            size="lg"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </Container>
  );
}
