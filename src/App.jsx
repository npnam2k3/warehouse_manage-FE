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
import CustomersPage from "./pages/Customers/CustomersPage";
import SuppliersPage from "./pages/Suppliers/SuppliersPage";
import ImportOrders from "./pages/ImportOrders/ImportOrders";
import ExportOrders from "./pages/ExportOrders/ExportOrders";
import SupplierDebt from "./pages/SupplierDebt/SupplierDebt";
import CustomerDebt from "./pages/CustomerDebt/CustomerDebt";
import StatisticReport from "./pages/StatisticReport/StatisticReport";
import { Role } from "./constant/role";
import { SocketProvider } from "./contexts/SocketContext";

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
          <SocketProvider>
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
                    <Route
                      element={<PrivateRoute allowedRoles={[Role.ADMIN]} />}
                    >
                      <Route path="users" element={<UserPage />} />
                    </Route>

                    {/* role accountant + admin */}
                    <Route
                      element={
                        <PrivateRoute
                          allowedRoles={[Role.ADMIN, Role.ACCOUNTANT]}
                        />
                      }
                    >
                      <Route path="setup" element={<SetupPage />} />
                      <Route path="customers" element={<CustomersPage />} />
                      <Route path="suppliers" element={<SuppliersPage />} />
                      <Route path="import-order" element={<ImportOrders />} />
                      <Route path="export-order" element={<ExportOrders />} />

                      <Route path="supplier-debt" element={<SupplierDebt />} />
                      <Route path="customer-debt" element={<CustomerDebt />} />
                      <Route
                        path="statistic-report"
                        element={<StatisticReport />}
                      />

                      <Route path="categories" element={<CategoriesPage />} />
                    </Route>

                    {/* role admin + accountant + warehouse_manager */}
                    <Route
                      element={
                        <PrivateRoute
                          allowedRoles={[
                            Role.ADMIN,
                            Role.ACCOUNTANT,
                            Role.WAREHOUSE_MANAGER,
                          ]}
                        />
                      }
                    >
                      <Route path="inventories" element={<Inventories />} />
                    </Route>

                    {/* route personal */}
                    <Route index element={<Dashboard />} />
                    <Route path="unauthorized" element={<ForbiddenPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route
                      path="changePassword"
                      element={<ChangePasswordPage />}
                    />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
