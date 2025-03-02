import { useState, useEffect, FormEvent } from "react";
import AccountBlock from "../components/AccountBlock";
import { formatAccounting } from "../utils/formatter";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({
    equityBal: 0,
    debtBal: 0,
    netWorth: 0,
  });

  const handleAcctUpdate = () => {
    getAccounts();
    getBalances();
  };

  const getAccounts = async () => {
    const response = await fetch("http://localhost:8080/api/accounts", {
      credentials: "include",
    });
    const data: { success: boolean; accounts: object[] } =
      await response.json();
    setAccounts(data.accounts);
  };

  const getBalances = async () => {
    const response = await fetch(
      "http://localhost:8080/api/accounts/balances",
      {
        credentials: "include",
      }
    );
    const data: { equityBal: number; debtBal: number; netWorth: number } =
      await response.json();
    setBalances(data);
  };

  useEffect(() => {
    getAccounts();
    getBalances();
  }, []);

  const addAccount = async (e: FormEvent) => {
    e.preventDefault();
    const newAcctName = e.target.name.value;
    const newAccountType = e.target.type.value;
    const newAccountBal = e.target.balance.value;
    const response = await fetch("http://localhost:8080/api/accounts/add", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name: newAcctName,
        type: newAccountType,
        balance: newAccountBal,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      getAccounts();
      getBalances();
      e.target.name.value = "";
      e.target.type.value = "";
      e.target.balance.value = "";
      return;
    }
    console.error(`ERROR = ${data.error}`);
    alert("Something went wrong...");
  };

  return (
    <div style={{ width: "100vw" }}>
      <h1 style={{ color: "#E5E7EB", marginBottom: "3%" }}>Accounts</h1>
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
        <div
          style={{
            height: "50vh",
            width: "45vw",
            padding: "2% 6% 2% 4%",
            overflowY: "auto",
            overflowX: "hidden",
            border: "5px solid #E5E7EB",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {accounts.map((acctData) => {
            return (
              <AccountBlock
                accountData={acctData}
                key={acctData._id}
                onUpdate={handleAcctUpdate}
              />
            );
          })}
        </div>
        <div
          style={{
            border: "5px solid #E5E7EB",
            borderRadius: "10px",
            width: "20vw",
            padding: "1.5vw",
            marginLeft: "5%",
            height: "15%",
            color: "#E5E7EB",
          }}
        >
          <h3>Balance Totals</h3>
          <table
            style={{
              marginTop: "2%",
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
            <tr>
              <td>Equity</td>
              <td>{formatAccounting(balances.equityBal)}</td>
            </tr>
            <tr>
              <td>Debt</td>
              <td>{formatAccounting(balances.debtBal)}</td>
            </tr>
            <tr style={{ color: "#A3E635" }}>
              <td>Net Worth (Estimate)</td>
              <td>{formatAccounting(balances.netWorth)}</td>
            </tr>
          </table>
        </div>
        <div style={{ marginTop: "2%" }}>
          <h3>Add Account</h3>
          <form onSubmit={addAccount}>
            <input type="text" placeholder="account name" name="name" />
            <br />
            <input type="text" placeholder="account type" name="type" />
            <br />
            <input type="text" placeholder="account balance" name="balance" />
            <br />
            <input type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
