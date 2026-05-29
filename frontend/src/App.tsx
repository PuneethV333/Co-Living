import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";


const Login = lazy(() => import("./pages/Login.tsx"))

const App = () => {
  return (
    <Suspense fallback={<Spinner/>}>
        
    <Routes>
        <Route path="/login" element={<Login/>}/>
            
    </Routes>
    </Suspense>
  )
};

export default App;
