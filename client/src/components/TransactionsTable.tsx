import { formatAccounting } from "../utils/formatter";

export default function TransactionsTable({
  transactionsData,
}: {
  transactionsData: {
    date: Date;
    description: string;
    amount: number;
    type: string;
    category: string;
  }[];
}) {
  return (
    <div style={{ width: "70%", marginTop: "2%" }}>
      <h2 style={{ marginBottom: "2%", color: "#E5E7EB " }}>
        Recent Transactions
      </h2>
      <table
        style={{
          width: "100%",
          color: "#E5E7EB",
          borderCollapse: "separate",
          borderSpacing: "0 1.5rem",
          border: "5px #E5E7EB solid",
          borderRadius: "10px",
        }}
      >
        <thead style={{ fontSize: "1.25rem" }}>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Category</th>
        </thead>
        <tbody>
          {transactionsData?.map((transaction, index) => {
            return (
              <tr style={{ textAlign: "center" }} key={index}>
                <td>{transaction.date.toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>
                  {transaction.type == "Debit"
                    ? formatAccounting(transaction.amount * -1)
                    : formatAccounting(transaction.amount)}
                </td>
                <td>{transaction.type}</td>
                <td>{transaction.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
