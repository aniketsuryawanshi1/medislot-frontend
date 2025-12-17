import React from "react";
import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";

const MainRoutes = () => (
  <Routes>
    {/* 404 Page */}
    <Route
      path="/"
      element={<h1 className="text-2xl p-6">MediSlot Frontend Running </h1>}
    />
  </Routes>
);

export default MainRoutes;
