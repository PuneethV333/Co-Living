import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Home/subPages/Dashboard";

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
          <Route path="/home" element={<Home/>}>
            <Route index element={<Dashboard/>}/>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
