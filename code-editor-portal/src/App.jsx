import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";
import CollaborativeCodeEditor from "./components/collaborative-code-editor";
import { useSelector } from "react-redux";
import Loader from "./components/Loader";
import axios from 'axios';
import { useEffect, useState } from "react";
import { setupAxiosInterceptors } from "./axiosSetup";
const PrivateRoute = ({ children }) => {
  let currentLoggedInUser = useSelector((state) => state.user?.currentUser);
console.log("currentLoggedInUser",currentLoggedInUser);
  if (!currentLoggedInUser) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the children (the actual page/component)
  return children;
};





function App() {
    let currentLoggedInUser = useSelector((state) => state.user?.currentUser);

    const [loading, setLoading] = useState(false); // Global loading state

    useEffect(() => {
        // Initialize global interceptors with loader management
        setupAxiosInterceptors(setLoading);
    }, []);
  return (
    <>
    {loading && <Loader />}
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
      </div>

      <Routes>
        <Route path="/login" element={currentLoggedInUser ?<Home/> : <Login/>}/>
         
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
       

        <Route
          path="/editor/:roomId"
          element={
            <PrivateRoute>
              <CollaborativeCodeEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/collabcode"
          element={
            <PrivateRoute>
              <CollaborativeCodeEditor />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
