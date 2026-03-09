type StatCardProps = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{label}</p>
      <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>{value}</h3>
    </div>
  );
}