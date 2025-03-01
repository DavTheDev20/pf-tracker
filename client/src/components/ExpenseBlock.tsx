import { formatAccounting } from "../utils/formatter";

export default function ExpenseBlock({
  expense,
}: {
  expense: {
    _id: string;
    name: string;
    amount: number;
    frequency: string;
    isPaid: boolean;
  };
}) {
  return (
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
    </div>
  );
}
