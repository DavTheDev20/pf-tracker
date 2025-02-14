import InfoCard from "../components/InfoCard";
import TransactionsTable from "../components/TransactionsTable";
import { formatAccounting } from "../utils/formatter";

export default function Dashboard() {
  const sampleTransData: {
    date: Date;
    description: string;
    amount: number;
    type: string;
    category: string;
  }[] = [
    {
      date: new Date("2/13/2025"),
      description: "Starbucks Coffee",
      amount: 6.95,
      type: "Debit",
      category: "Food & Beverage",
    },
    {
      date: new Date("2/07/2025"),
      description: "Premier Dermatology Direct Deposit",
      amount: 1525.65,
      type: "Credit",
      category: "Salary/Wages",
    },
  ];

  const sampleBills: { name: string; date: Date; amount: number }[] = [
    { name: "Netflix", date: new Date("2/18/2025"), amount: 11.99 },
    { name: "Spotify", date: new Date("2/25/2025"), amount: 10.99 },
    { name: "Rent", date: new Date("3/01/2025"), amount: 1500 },
    { name: "Xfinity Wifi", date: new Date("3/05/2025"), amount: 65 },
  ];

  return (
    <div style={{ width: "95vw" }}>
      <h1 style={{ color: "#E5E7EB " }}>Dashboard</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginRight: "1%",
          justifyContent: "space-between",
        }}
      >
        <InfoCard
          bgColor="#0A192F"
          content={{
            heading: "TD Checking Balance",
            body: "$792.44",
            footer: `last updated ${new Date("2/13/2025").toLocaleDateString(
              "en-US",
              { dateStyle: "medium" }
            )}`,
          }}
        />
        <InfoCard
          bgColor="#00B4D8"
          content={{ heading: "Spending Remaining", body: "$266.83" }}
        />
        <InfoCard
          bgColor="#0A192F"
          content={{
            heading: "Savings Total",
            body: "$12,213.59",
          }}
        />
        <TransactionsTable transactionsData={sampleTransData} />
        <div
          style={{
            border: "5px solid #E5E7EB",
            borderRadius: "10px",
            width: "25%",
            marginTop: "3%",
            textAlign: "center",
            color: "#E5E7EB",
            backgroundColor: "#081624",
          }}
        >
          <h3 style={{ marginTop: "2%" }}>Upcoming Bills</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 1.5rem",
            }}
          >
            {sampleBills?.map((bill) => {
              return (
                <tr>
                  <td>{bill.name}</td>
                  <td>{bill.date.toLocaleDateString()}</td>
                  <td>{formatAccounting(bill.amount)}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
