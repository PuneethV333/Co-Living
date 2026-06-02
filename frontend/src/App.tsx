import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";

import { Auth } from "./config/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useGetMe } from "./hooks/useAuth";

const Login = lazy(() => import("./pages/Login/Login"));
const OnBoarding = lazy(() => import("./pages/OnBoarding/OnBoarding"));
const Dashboard = lazy(() => import("./pages/Home/subPages/Dashboard"));
const PropertyDetail = lazy(() => import("./pages/property/PropertyDetail"));
const App = () => {
  const [user, authLoading] = useAuthState(Auth);
  const { data, isPending } = useGetMe();

  if (authLoading || (user && isPending)) {
    return <Spinner />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : !data?.completeOnBoarding ? (
                <Navigate to="/on-boarding" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/on-boarding"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : data?.completeOnBoarding ? (
                <Navigate to="/home" replace />
              ) : (
                <OnBoarding />
              )
            }
          />
          <Route
            path="/home"
            element={
              user ? (
                data?.completeOnBoarding ? (
                  <Home />
                ) : (
                  <Navigate to="/on-boarding" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="property/details/:id" element={<PropertyDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
