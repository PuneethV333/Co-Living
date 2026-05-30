import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import { Toaster } from "react-hot-toast";

const Login = lazy(() => import("./pages/Login/Login"));
const OnBoarding = lazy(() => import("./pages/OnBoarding/OnBoarding"));
const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/on-boarding" element={<OnBoarding />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
