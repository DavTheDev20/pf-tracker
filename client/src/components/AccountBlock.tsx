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
        backgroundColor: "#0A192F",
        width: "100%",
        padding: "4%",
        borderRadius: "10px",
        color: "#E5E7EB",
        marginBottom: "2%",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        height: "15vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ fontWeight: "bold", width: "65%" }}>
        {accountData.name} (
        <small>{accountData.type.toLocaleUpperCase("en-US")}</small>)
        <p style={{ fontSize: "1rem" }}>
          {formatAccounting(accountData.balance)}
        </p>
      </p>
      <button style={{ width: "15%", cursor: "pointer", marginTop: "2%" }}>
        Edit
      </button>
    </div>
  );
}
