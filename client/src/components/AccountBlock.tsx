import { FormEvent, useState } from "react";
import { formatAccounting } from "../utils/formatter";

export default function AccountBlock({
  accountData,
  onUpdate,
}: {
  accountData: {
    _id: string;
    name: string;
    type: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
  };
  onUpdate: any;
}) {
  const [editable, setEditable] = useState(false);

  const accountBlockStyles = {
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
  };

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();

    const acctName: string | null = e.target.acctName.value;
    const acctType: string | null = e.target.acctType.value;
    const acctBalance: number | null = e.target.acctBalance.value;

    console.log(acctName);

    const response = await fetch(
      `http://localhost:8080/api/accounts/update/${accountData._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: acctName,
          type: acctType,
          balance: acctBalance,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.success) {
      setEditable(false);
      onUpdate();
      return;
    }
  };

  return (
    <>
      <div style={accountBlockStyles}>
        <p style={{ fontWeight: "bold", width: "65%" }}>
          <span style={{ color: "#A3E635" }}>{accountData.name}</span> (
          <small>{accountData.type.toLocaleUpperCase("en-US")}</small>)
          <p style={{ fontSize: "1rem" }}>
            {formatAccounting(accountData.balance)}
          </p>
        </p>
        <button
          style={{ width: "15%", cursor: "pointer", marginTop: "2%" }}
          onClick={() => {
            setEditable(!editable);
          }}
        >
          Edit
        </button>
      </div>
      {editable ? (
        <div
          style={{
            border: "2px solid #E5E7EB",
            backgroundColor: "#00B4D8",
            width: "100%",
            padding: "4%",
            borderRadius: "10px",
            color: "#E5E7EB",
            marginBottom: "2%",
            height: "15vh",
          }}
        >
          <h3>Update Account</h3>
          <form onSubmit={submitEdit}>
            <label>Name </label>
            <input type="text" name="acctName" />
            <label>Type </label>
            <input type="text" name="acctType" />
            <label>Balance </label>
            <input type="text" name="acctBalance" />
            <br />
            <input type="submit" />
          </form>
        </div>
      ) : null}
    </>
  );
}
