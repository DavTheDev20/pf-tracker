export default function InfoCard({
  content,
  bgColor,
}: {
  content: {
    heading: string;
    body: string;
    footer?: string;
  };
  bgColor: string;
}) {
  return (
    <div
      style={{
        marginTop: "3%",
        border: "5px #E5E7EB solid",
        backgroundColor: bgColor,
        width: "25%",
        height: "30vh",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "space-around",
        color: "#E5E7EB",
      }}
    >
      <h3 style={{ marginBottom: "5%" }}>{content.heading}</h3>
      <p style={{ fontSize: "1.5rem" }}>{content.body}</p>
      {content.footer ? <small>{content.footer}</small> : null}
    </div>
  );
}
