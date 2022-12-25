import React from "react";
import Footer from "../parts/Footer";
import Header from "../parts/Header";
import "../styles/home.css";
import { ImArrowRight } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="container_home">
      <Header />
      <div className="container_home-main">
        <h1 className="home_header-text">URL Shortener</h1>
        <h5 className="home_subheader-text">
          Simplifying your links is just click of a button away 😎
        </h5>
        <p className="home_landing-text">
          Sign up for free to explore <ImArrowRight />{" "} &nbsp;&nbsp;
          <Button
            color="success"
            outline
            size="lg"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>{" "}
        </p>
      </div>
      <Footer />
    </div>
  );
}
