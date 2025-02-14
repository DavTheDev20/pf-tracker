import Accounts from "./views/Accounts";
import { useContext } from "react";
import AuthContext from "./AuthContext";
import Dashboard from "./views/Dashboard";

export default function Root({ page }: { page: string }) {
  const { user } = useContext(AuthContext);

  return (
    <>
      {!user ? (
        <div style={{ textAlign: "center", width: "75vw", margin: "0 auto" }}>
          <h1 style={{ marginTop: "25vh", color: "#E5E7EB" }}>
            Welcome to Budget Butler!
          </h1>
          <p style={{ color: "#E5E7EB" }}>Please login.</p>
        </div>
      ) : page === "dash" ? (
        <Dashboard />
      ) : page == "accounts" ? (
        <Accounts />
      ) : null}
      {}
      {}
    </>
  );
}
