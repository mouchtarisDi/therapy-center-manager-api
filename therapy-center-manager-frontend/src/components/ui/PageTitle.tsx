type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>{title}</h1>
      {subtitle ? (
        <p style={{ marginTop: "8px", color: "#64748b" }}>{subtitle}</p>
      ) : null}
    </div>
  );
}