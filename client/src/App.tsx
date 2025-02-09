import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Accounts from "./views/Accounts";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ display: "flex" }}>
      <NavBar setPageFunc={setPage} />
      {page === "home" ? <Home /> : null}
      {page === "accounts" ? <Accounts /> : null}
    </div>
  );
}

export default App;
