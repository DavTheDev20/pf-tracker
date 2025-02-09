export default function NavBar({
  setPageFunc,
}: {
  setPageFunc: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div
      id="navbar"
      style={{
        backgroundColor: "lightblue",
        width: "10%",
        marginRight: "2%",
        padding: "2%",
        height: "91.9dvh",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <h3>Budget Butler</h3>
      <a href="#" onClick={() => setPageFunc("home")}>
        Home
      </a>
      <br />
      <a href="#" onClick={() => setPageFunc("accounts")}>
        Accounts
      </a>
    </div>
  );
}
