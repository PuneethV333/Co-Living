import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import {Toaster} from "react-hot-toast"


const Login = lazy(() => import("./pages/Login/Login"))

const App = () => {
  return (
    
    <>
    <Toaster position="top-right" />
      <Suspense fallback={<Spinner/>}>
        
    <Routes>
        <Route path="/login" element={<Login/>}/>
            
    </Routes>
    </Suspense>
    </>
    
  
  )
};

export default App;
