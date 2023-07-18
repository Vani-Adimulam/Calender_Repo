import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" replace state={{ from: props.location }} />
        )
      }
    />
  );
};

export default PrivateRoute;
