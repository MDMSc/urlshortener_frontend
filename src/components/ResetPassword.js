import React, { useEffect, useState } from "react";
import "../styles/forgot.css";
import { useFormik } from "formik";
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
import * as yup from "yup";
import { API_USERS } from "../Global";
import { useNavigate, useParams } from "react-router-dom";

const initialValues = {
  password: "",
  confirmPassword: "",
};

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Required!!!")
    .min(5, "Password should be at least 5 characters"),
  confirmPassword: yup
    .string()
    .required("Required!!!")
    .oneOf([yup.ref("password"), null], "Password does not match"),
});

export default function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (resetToken) {
      fetch(`${API_USERS}/reset-password/${resetToken}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok || data.isSuccess === false) {
            const resError = (data && data.message) || response.statusText;
            setError(resError);
            return Promise.reject(resError);
          }
        })
        .catch((error) => {
          setError(error.toString());
        });
    } else {
      setError(
        "Invalid activation link. Kindly click the activation link sent to your email."
      );
    }
  }, [resetToken]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      fetch(`${API_USERS}/reset-password/${resetToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
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
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((error) => {
          setError(error.toString());
        });
    },
  });
  return (
    <Container className="container_forgot">
      {error !== "" && (
        <UncontrolledAlert className="msg_alert_forgot" color="danger" fade>
          {error}
        </UncontrolledAlert>
      )}
      {success !== "" && (
        <UncontrolledAlert className="msg_alert_forgot" color="success" fade>
          {success}
        </UncontrolledAlert>
      )}
      <div className="forgot_main_container">
        <h1 className="text-center mt-4">
          <b>Reset Password</b>
        </h1>
        <Form className="forgot_main_form" onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Label for="password">
              <b>New Password</b>
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Your New Password"
              type="password"
              disabled={error}
              invalid={formik.errors.password && formik.touched.password}
              {...formik.getFieldProps("password")}
            />

            {formik.errors.password && formik.touched.password && (
              <FormFeedback style={{ display: "inline" }}>
                {formik.errors.password}
              </FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="confirmPassword">
              <b>Confirm Password</b>
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              disabled={error}
              invalid={
                formik.errors.confirmPassword && formik.touched.confirmPassword
              }
              {...formik.getFieldProps("confirmPassword")}
            />

            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
                <FormFeedback style={{ display: "inline" }}>
                  {formik.errors.confirmPassword}
                </FormFeedback>
              )}
          </FormGroup>
          <Button
            type="submit"
            color="success"
            outline
            className="my-4"
            disabled={error}
          >
            Reset Password
          </Button>
        </Form>
      </div>
    </Container>
  );
}
