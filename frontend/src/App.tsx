// src/App.tsx
import { Routes, Route } from "react-router-dom";

import RoleRoute from "./components/RoleRoute";
import AuthLayout from "./layout/AuthLayout";
import PortalLayout from "./layout/PortalLayout";
import WorkerLayout from "./layout/WorkerLayout";
import AdminLayout from "./layout/AdminLayout";

import Root from "./pages/Root";
import ParentsLogin from "./pages/ParentsLogin";
import Appointment from "./pages/Appointment";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Confirm from "./pages/Confirm";
import Succes from "./pages/Succes";

import Overview from "./pages/Overview";
import Availability from "./pages/Availability";

import AdminClasses from "./pages/AdminClasses";
import AdminUsers from "./pages/AdminUsers";
import AdminOverview from "./pages/AdminOverview";
import AdminParentCodes from "./pages/AdminParentCodes";

import DebugMenu from "./components/DebugMenu";

function App() {
  return (
    <>
      <DebugMenu />
      <Routes>
        {/* Root route */}
        <Route
          path="/"
          element={
            <AuthLayout>
              <Root />
            </AuthLayout>
          }
        />

        <Route
          path="/Parents/Login"
          element={
            <AuthLayout>
              <ParentsLogin />
            </AuthLayout>
          }
        />
        <Route
          path="/Parents/Appointment"
          element={
            <AuthLayout>
              <Appointment />
            </AuthLayout>
          }
        />
        <Route
          path="/Login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route path="/Parents" element={<PortalLayout />}>
          <Route path="Booking" element={<Booking />} />
          <Route path="Confirm" element={<Confirm />} />
          <Route path="Succes" element={<Succes />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["mentor", "dean"]} />}>
          <Route element={<WorkerLayout />}>
            <Route path="/Overview" element={<Overview />} />
            <Route path="/Availability" element={<Availability />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="classes" element={<AdminClasses />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="Overview" element={<AdminOverview />} />
            <Route path="parent-codes" element={<AdminParentCodes />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
