import { useEffect, useState } from "react";
import ExpenseBlock from "../components/ExpenseBlock";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const getExpenses = async () => {
    const response = await fetch("http://localhost:8080/api/expenses", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      setExpenses(data.expenses);
      return;
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div>
      <h1 style={{ color: "#E5E7EB" }}>Expenses</h1>
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
        {expenses.map((expense) => {
          return <ExpenseBlock expense={expense} />;
        })}
      </div>
    </div>
  );
}
