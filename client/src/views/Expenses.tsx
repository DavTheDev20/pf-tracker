import { FormEvent, useEffect, useState } from "react";
import ExpenseBlock from "../components/ExpenseBlock";
import { formatAccounting } from "../utils/formatter";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [unpaidExpenseTotal, setUnpaidExpenseTotal] = useState(0);

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

  const getUnpaidTotal = async () => {
    const response = await fetch(
      "http://localhost:8080/api/expenses/unpaid-expenses",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: { success: boolean; unpaidExpenseTotal: number } =
      await response.json();
    if (data.success) {
      setUnpaidExpenseTotal(data.unpaidExpenseTotal);
      return;
    }
    alert("Something went wrong...");
  };

  const createExpense = async (e: FormEvent) => {
    e.preventDefault();

    const { expenseName, expenseAmount, expenseFrequency } = e.target;

    const response = await fetch(`http://localhost:8080/api/expenses/add`, {
      method: "POST",
      body: JSON.stringify({
        name: expenseName.value,
        amount: expenseAmount.value,
        frequency: expenseFrequency.value,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      expenseName.value = "";
      expenseAmount.value = "";
      expenseFrequency.value = "monthly";
      getExpenses();
      getUnpaidTotal();
      return;
    }

    alert("Something went wrong...");
  };

  useEffect(() => {
    getExpenses();
    getUnpaidTotal();
  }, []);

  const onChange = () => {
    getExpenses();
    getUnpaidTotal();
  };

  return (
    <>
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
          <h2 style={{ marginBottom: "2%", color: "#E5E7EB" }}>Expenses</h2>
          {expenses.map((expense) => {
            return <ExpenseBlock expense={expense} handleChange={onChange} />;
          })}
        </div>
        <div
          style={{
            border: "5px solid #E5E7EB",
            width: "20vw",
            height: "5vh",
            borderRadius: "10px",
            padding: "3%",
            color: "#E5E7EB",
          }}
        >
          <p>
            Unpaid Expense Total (
            {new Date().toLocaleDateString("en-US", { month: "long" })})
          </p>
          <p
            style={{
              marginTop: "2%",
              fontWeight: "bold",
              color: "#A3E635",
              fontSize: "1.1rem",
            }}
          >
            {formatAccounting(unpaidExpenseTotal)}
          </p>
        </div>
        <div>
          <h2>Add Expense</h2>
          <form onSubmit={createExpense}>
            <label>Name</label>
            <input type="text" name="expenseName" />
            <br />
            <label>Amount</label>
            <input type="text" name="expenseAmount" />
            <br />
            <label>Frequency</label>
            <select name="expenseFrequency">
              <option value={"monthly"}>Monthly</option>
              <option value={"bi-weekly"}>Bi-Weekly</option>
            </select>
            <br />
            <input type="submit" />
          </form>
        </div>
      </div>
    </>
  );
}
