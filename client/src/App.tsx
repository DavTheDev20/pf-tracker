import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./AuthContext";
import Root from "./Root";

function App() {
  const [page, setPage] = useState("dash");

  return (
    <AuthProvider>
      <div style={{ display: "flex" }}>
        <NavBar setPageFunc={setPage} page={page} />
        <Root page={page} />
      </div>
    </AuthProvider>
  );
}

export default App;
