import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import UserPage from "./pages/UserManagement/UserPage";
import { createTheme, ThemeProvider } from "@mui/material";
import LoginPage from "./pages/Auth/LoginPage";
import { ToastProvider } from "./contexts/toastProvider";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthProvider";
import ForbiddenPage from "./pages/Auth/ForbiddenPage";
import RequireAuth from "./components/RequireAuthRoute";
import ProfilePage from "./pages/Auth/ProfilePage";
import ChangePasswordPage from "./pages/Auth/ChangePasswordPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import Dashboard from "./pages/DashBoard/DashBoard";
import CategoriesPage from "./pages/Categories/CategoriesPage";
import SetupPage from "./pages/Setup/SetupPage";
import Inventories from "./pages/Inventories/Inventories";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/*public route */}
              <Route path="login" element={<LoginPage />} />
              <Route path="forgotPassword" element={<ForgotPassword />} />
              <Route
                path="resetPassword/:token"
                element={<ResetPasswordPage />}
              />

              {/* private route */}
              <Route element={<RequireAuth />}>
                <Route path="/" element={<MainLayout />}>
                  {/* role admin */}
                  <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
                    <Route path="users" element={<UserPage />} />
                  </Route>

                  {/* role accountant */}
                  <Route index element={<Dashboard />} />
                  <Route path="unauthorized" element={<ForbiddenPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route
                    path="changePassword"
                    element={<ChangePasswordPage />}
                  />

                  <Route path="inventories" element={<Inventories />} />
                  <Route path="setup" element={<SetupPage />} />
                  <Route path="customers" element={<UserPage />} />
                  <Route path="suppliers" element={<UserPage />} />
                  <Route path="import-order" element={<UserPage />} />
                  <Route path="export-order" element={<UserPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
