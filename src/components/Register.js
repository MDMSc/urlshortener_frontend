import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/register.css";
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
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { API_USERS } from "../Global";

const initialValues = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
};

const validationSchema = yup.object().shape({
  email: yup.string().email().required("Required!!!"),
  firstName: yup.string().required("Required!!!"),
  lastName: yup.string().required("Required!!!"),
  password: yup
    .string()
    .required("Required!!!")
    .min(5, "Password should be at least 5 characters"),
});

export default function Register() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      fetch(`${API_USERS}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          const isJson = response.headers
            .get("Content-type")
            ?.includes("application/json");
          const data = isJson && (await response.json());

          if (!response.ok || data.isSuccess === false) {
            const resError = (data && data.message) || response.status;
            setError(resError);
            return Promise.reject(resError);
          }

          setSuccess(data && data.message);
        })
        .catch((error) => {
          setError(error.toString());
        });
    },
  });

  return (
    <Container className="container_register">
      {error !== "" && <UncontrolledAlert className="msg_alert_reset" color="danger" fade>{error}</UncontrolledAlert>}
      {success !== "" && <UncontrolledAlert className="msg_alert_reset" color="success" fade>{success}</UncontrolledAlert>}
      <div className="register_main_container">
        <div className="register_main_section">
          <h1 className="text-center">
            <b>Sign Up</b>
          </h1>
          <Form className="register_main_form" onSubmit={formik.handleSubmit}>
            <FormGroup>
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

            <FormGroup>
              <Label for="firstName">
                <b>First Name</b>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Your First Name"
                type="firstName"
                invalid={formik.errors.firstName && formik.touched.firstName}
                {...formik.getFieldProps("firstName")}
              />

              {formik.errors.firstName && formik.touched.firstName && (
                <FormFeedback style={{ display: "inline" }}>
                  {formik.errors.firstName}
                </FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="lastName">
                <b>Last Name</b>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Your Last Name"
                type="lastName"
                invalid={formik.errors.lastName && formik.touched.lastName}
                {...formik.getFieldProps("lastName")}
              />

              {formik.errors.lastName && formik.touched.lastName && (
                <FormFeedback style={{ display: "inline" }}>
                  {formik.errors.lastName}
                </FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
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
            <Button type="submit" color="success" outline className="mt-3">
              Sign Up
            </Button>
          </Form>
        </div>
        <div className="container login_main_section">
          <h3 className="mb-2">Already have an account?</h3>
          <Button
            color="success"
            outline
            block
            size="lg"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </Container>
  );
}
