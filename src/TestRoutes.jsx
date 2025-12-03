// Test simplified routing structure
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";

const TestRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<div>Login Page</div>} />

      {/* Protected Routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<div>Dashboard</div>} />
        <Route path="orders/*" element={<div>Orders Module</div>} />
        <Route path="analytics/*" element={<div>Analytics Module</div>} />
      </Route>
    </Routes>
  );
};

export default TestRoutes;
