import { FormEvent, useState } from "react";
import { formatAccounting } from "../utils/formatter";

export default function ExpenseBlock({
  expense,
  handleChange,
}: {
  expense: {
    _id: string;
    name: string;
    amount: number;
    frequency: string;
    isPaid: boolean;
  };
  handleChange: any;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [expensePaid, setExpensePaid] = useState(expense.isPaid);

  const updateExpense = async (e: FormEvent) => {
    e.preventDefault();

    const { expenseName, expenseAmount, expenseFrequency, expensePaid } =
      e.target;

    const response = await fetch(
      `http://localhost:8080/api/expenses/update/${expense._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: expenseName.value || null,
          amount: expenseAmount.value || null,
          frequency: expenseFrequency.value || null,
          isPaid: expensePaid.checked === true ? true : false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    if (data.success) {
      setIsEditable(false);
      handleChange();
      return;
    }

    alert("Something went wrong...");
  };

  return (
    <>
      <div
        style={{
          border: "4px solid #E5E7EB",
          borderRadius: "10px",
          width: "75%",
          padding: "5%",
          color: "#E5E7EB",
          marginBottom: "2%",
          backgroundColor: "#10192d",
        }}
      >
        <p style={{ fontWeight: "bold", color: "#A3E635" }}>{expense.name}</p>
        <p>{formatAccounting(expense.amount)}</p>
        <p>{expense.frequency}</p>
        <p>{expense.isPaid ? "PAID" : "NOT PAID"}</p>
        <button
          style={{ padding: "1%", width: "15%" }}
          onClick={() => setIsEditable(!isEditable)}
        >
          Edit
        </button>
      </div>
      {isEditable ? (
        <div
          style={{
            border: "4px solid #E5E7EB",
            borderRadius: "10px",
            width: "75%",
            padding: "5%",
            color: "#E5E7EB",
            marginBottom: "2%",
            backgroundColor: "#00B4D8",
          }}
        >
          <h3>Edit Expense</h3>
          <form onSubmit={updateExpense}>
            <label>Name</label>
            <input type="text" name="expenseName" />
            <br />
            <label>Amount</label>
            <input type="text" name="expenseAmount" />
            <br />
            <label>Frequency</label>
            <select name="expenseFrequency">
              <option value="monthly">Monthly</option>
              <option value="bi-weekly">Bi-Weekly</option>
            </select>
            <br />
            <label>Is Paid </label>
            <input
              name="expensePaid"
              type="checkbox"
              defaultChecked={expense.isPaid ? true : false}
            />
            <br />
            <input type="submit" />
          </form>
        </div>
      ) : null}
    </>
  );
}
