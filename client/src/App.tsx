import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Accounts from "./views/Accounts";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ display: "flex" }}>
      <NavBar setPageFunc={setPage} />
      {page === "home" ? <Home /> : null}
      {page === "accounts" ? <Accounts /> : null}
      {page === "auth" ? (
        <PrivateRoute>
          <p>Your Authenticated</p>
        </PrivateRoute>
      ) : null}
    </div>
  );
}

export default App;
