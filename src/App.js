import React, { useReducer } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Home from "./components/Home";
import Activation from "./components/Activation";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UserHome from "./components/UserHome";
import AdminHome from "./components/AdminHome";
import { Reducer } from "./context/Reducer";
import { Context } from "./context/Context";
import ProtectedRoute from "./intermediateRoutes/ProtectedRoute";
import UserRoute from "./intermediateRoutes/UserRoute";

function App() {
  const [state, dispatch] = useReducer(Reducer, {
    isLoggedIn: false,
    user: {},
  });

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("isLoggedIn") ? (
                <UserRoute>
                  <AdminHome />
                </UserRoute>
              ) : (
                <Home />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/signup" element={<Register />} />
          <Route
            path="/account-activation/:activationToken"
            element={<Activation />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserRoute>
                  <AdminHome />
                </UserRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Context.Provider>
  );
}

export default App;
