import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container } from "reactstrap";
import "../styles/activation.css";
import { useNavigate, useParams } from "react-router-dom";
import { API_USERS } from "../Global";

export default function Activation() {
  const { activationToken } = useParams();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (activationToken) {
      fetch(`${API_USERS}/confirmation/${activationToken}`, {
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

          setSuccess(data.message);
        })
        .catch((error) => {
          setError(error.toString());
        });
    } else {
      setError(
        "Invalid activation link. Kindly click the activation link sent to your email."
      );
    }
  }, [activationToken]);

  return (
    <Container>
      <div className="activation_container text-center">
        {error !== "" ? (
          <h1 className="pt-5 px-3 error">{error}</h1>
        ) : (
          success !== "" && <h1 className="pt-5 px-3">{success}</h1>
        )}

        <h5 className="pt-5">Kindly proceed to Login page.</h5>
        <Button color="success" className="mt-3 mb-5" size="lg" onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>
    </Container>
  );
}
