import { formatAccounting } from "../utils/formatter";

export default function AccountBlock({
  accountData,
}: {
  accountData: {
    name: string;
    type: string;
    balance: number;
  };
}) {
  return (
    <div
      style={{
        border: "2px solid #E5E7EB",
        backgroundColor: "#00B4D8",
        width: "100%",
        padding: "2%",
        borderRadius: "10px",
        color: "#E5E7EB",
        marginBottom: "1.5%",
        display: "flex",
        flexDirection: "column",
        height: "15vh",
        justifyContent: "center",
      }}
    >
      <p style={{ fontWeight: "bold" }}>{accountData.name}</p>
      <p>Account Type: {accountData.type}</p>
      <p>Balance: {formatAccounting(accountData.balance)}</p>
      <button style={{ width: "25%", cursor: "pointer" }}>Edit</button>
    </div>
  );
}
