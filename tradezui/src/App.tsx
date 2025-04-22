import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/Routes";
// import { UserProvider } from "./Context/useAuth";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* <UserProvider> */}
        <AppRoutes />
      {/* </UserProvider> */}
    </BrowserRouter>
  );
}

export default App;
