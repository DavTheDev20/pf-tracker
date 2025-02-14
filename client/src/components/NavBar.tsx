import { FormEvent, useContext } from "react";
import AuthContext from "../AuthContext";

export default function NavBar({
  setPageFunc,
  page,
}: {
  setPageFunc: React.Dispatch<React.SetStateAction<string>>;
  page: string;
}) {
  const { login, logout, user } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email: string = e.target?.email.value;
    const password: string = e.target?.password.value;
    await login(email, password);
  };

  const linkStyles = {
    color: "#E5E7EB",
    cursor: "pointer",
    display: "flex",
    marginTop: "30%",
    fontSize: "18px",
    alignItems: "center",
  };
  return (
    <div
      id="navbar"
      style={{
        backgroundColor: "#1E293B",
        borderRight: "2px solid #E5E7EB",
        width: "12%",
        marginRight: "1%",
        padding: "2%",
        height: "91.9dvh",
        overflow: "hidden",
        textAlign: "center",
        color: "#E5E7EB",
      }}
    >
      <h3 style={{ color: "#A3E635" }}>Budget Butler</h3>
      {user ? (
        <>
          <h4 style={{ margin: "10% 0", color: "#E5E7EB" }}>
            Hello {user.firstName}
          </h4>
          <button
            onClick={logout}
            style={{
              margin: "10% 0 5% 0",
              backgroundColor: "#A3E635",
              padding: "5%",
              width: "75%",
              cursor: "pointer",
              borderRadius: "5px",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>

          <a style={linkStyles} onClick={() => setPageFunc("dash")}>
            Dashboard{" "}
            <img
              src="https://img.icons8.com/?size=100&id=SvzY7bP2Zldz&format=png&color=FFFFFF"
              width={25}
              height={25}
              style={
                page == "dash"
                  ? { marginLeft: "10px", borderBottom: "2px solid #b4e35a" }
                  : { marginLeft: "10px" }
              }
            />
          </a>

          <a style={linkStyles} onClick={() => setPageFunc("accounts")}>
            Accounts
            <img
              src="https://img.icons8.com/?size=100&id=L6rNK7BfVpdm&format=png&color=FFFFFF"
              width={25}
              height={25}
              style={
                page == "accounts"
                  ? { marginLeft: "10px", borderBottom: "2px solid #b4e35a" }
                  : { marginLeft: "10px" }
              }
            />
          </a>
          <a style={linkStyles} onClick={() => setPageFunc("transactions")}>
            Transactions
            <img
              src="https://img.icons8.com/?size=100&id=ivCV8Ffm25sy&format=png&color=FFFFFF"
              width={25}
              height={25}
              style={
                page == "transactions"
                  ? { marginLeft: "10px", borderBottom: "2px solid #b4e35a" }
                  : { marginLeft: "10px" }
              }
            />
          </a>
          <a style={linkStyles} onClick={() => setPageFunc("insights")}>
            Insights
            <img
              src="https://img.icons8.com/?size=100&id=L60ScYWkMpdx&format=png&color=FFFFFF"
              width={25}
              height={25}
              style={
                page == "insights"
                  ? { marginLeft: "10px", borderBottom: "2px solid #b4e35a" }
                  : { marginLeft: "10px" }
              }
            />
          </a>
          <a style={linkStyles} onClick={() => setPageFunc("settings")}>
            Settings
            <img
              src="https://img.icons8.com/?size=100&id=UXWIv5G5mWsK&format=png&color=FFFFFF"
              width={25}
              height={25}
              style={
                page == "settings"
                  ? { marginLeft: "10px", borderBottom: "2px solid #b4e35a" }
                  : { marginLeft: "10px" }
              }
            />
          </a>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: "15%" }}>
          <h3>Login</h3>
          <input type="email" name="email" placeholder="email..." />
          <input type="password" name="password" placeholder="password..." />
          <input type="submit" value={"Login"} />
        </form>
      )}
    </div>
  );
}
