import { FormEvent, useEffect, useState } from "react";

export default function Settings() {
  const [editSpendBuffer, setEditSpendBuffer] = useState(false);
  const [spendingBuffer, setSpendingBuffer] = useState(0);
  const [editPeriodSavings, setEditPeriodSavings] = useState(false);
  const [periodSavings, setPeriodSavings] = useState(false);

  const getUserInfo = async () => {
    const response = await fetch("http://localhost:8080/api/auth/user-info", {
      credentials: "include",
    });

    const data = await response.json();

    setSpendingBuffer(data.userInfo.spendingBuffer);
    setPeriodSavings(data.userInfo.periodSavings);
  };

  const handleEditSpendBuffer = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:8080/api/auth/update/user-info",
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          spendingBuffer: e.target.spendingBuffer.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.success == true) {
      setEditSpendBuffer(false);
      getUserInfo();
      return;
    }

    alert("Something went wrong...");
  };

  const handleEditPeriodSavings = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:8080/api/auth/update/user-info",
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          periodSavings: e.target.periodSavings.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.success == true) {
      setEditPeriodSavings(false);
      getUserInfo();
      return;
    }

    alert("Something went wrong...");
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        margin: "2% 2% 0",
        color: "#E5E7EB",
      }}
    >
      <div
        style={{
          height: "50vh",
          width: "45vw",
          padding: "2% 6% 2% 4%",
          overflowY: "auto",
          overflowX: "hidden",
          border: "5px solid #E5E7EB",
          borderRadius: "10px",
          alignItems: "center",
        }}
      >
        <h2 style={{ marginBottom: "2%" }}>Settings</h2>
        {editSpendBuffer ? (
          <form onSubmit={handleEditSpendBuffer}>
            <label>Set Spending Buffer</label>
            <input type="text" name="spendingBuffer" />
            <input type="submit" />
          </form>
        ) : (
          <>
            <p style={{ display: "inline-block" }}>
              Spending Buffer: {spendingBuffer}
            </p>
            <button
              onClick={() => setEditSpendBuffer(true)}
              style={{ display: "inline-block", marginLeft: "2%" }}
            >
              Set Buffer
            </button>
          </>
        )}
        <br />
        <br />
        {editPeriodSavings ? (
          <form onSubmit={handleEditPeriodSavings}>
            <label>Savings for Period</label>
            <input type="text" name="periodSavings" />
            <input type="submit" />
          </form>
        ) : (
          <>
            <p style={{ display: "inline-block" }}>
              Set Savings Amount for Period: {periodSavings}
            </p>
            <button
              onClick={() => setEditPeriodSavings(true)}
              style={{ display: "inline-block", marginLeft: "2%" }}
            >
              Set Savings
            </button>
          </>
        )}
      </div>
    </div>
  );
}
