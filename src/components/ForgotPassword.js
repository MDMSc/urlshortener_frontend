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

const initialValues = {
  email: "",
};

const validationSchema = yup.object().shape({
  email: yup.string().email().required("Required!!!"),
});

export default function ForgotPassword() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  function setVisibility() {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
  };

  useEffect(() => {
    setVisibility();
  }, [success, error]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      fetch(`${API_USERS}/forgot-password`, {
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
          setVisibility();
        })
        .catch((error) => {
          setError(error.toString());
        });
    },
  });
  return (
    <Container className="container_forgot">
      {error !== "" && (
        <UncontrolledAlert
        className="msg_alert_forgot"
        color="danger"
        isOpen={visible}
        fade
      >
        {error}
      </UncontrolledAlert>
      )}
      {success !== "" && (
        <UncontrolledAlert className="msg_alert_forgot" color="success" isOpen={visible} fade>
          {success}
        </UncontrolledAlert>
      )}
      <div className="forgot_main_container">
        <h1 className="text-center mt-4">
          <b>Forgot Password ?</b>
        </h1>
        <Form className="forgot_main_form" onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Label for="email">
              <b>Email</b>
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Your Email Address"
              type="email"
              bsSize="lg"
              invalid={formik.errors.email && formik.touched.email}
              {...formik.getFieldProps("email")}
            />

            {formik.errors.email && formik.touched.email && (
              <FormFeedback style={{ display: "inline" }}>
                {formik.errors.email}
              </FormFeedback>
            )}
          </FormGroup>
          <Button type="submit" color="success" outline className="my-3">
            Send Reset Link
          </Button>
        </Form>
      </div>
    </Container>
  );
}
