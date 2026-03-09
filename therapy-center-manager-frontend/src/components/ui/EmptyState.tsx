type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px dashed #cbd5e1",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {description ? <p style={{ color: "#64748b" }}>{description}</p> : null}
    </div>
  );
}