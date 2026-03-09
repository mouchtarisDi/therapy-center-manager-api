type StatusTone = "neutral" | "success" | "warning" | "danger";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

const toneStyles: Record<
  StatusTone,
  { background: string; color: string }
> = {
  neutral: {
    background: "#e2e8f0",
    color: "#334155",
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
  },
  warning: {
    background: "#fef3c7",
    color: "#92400e",
  },
  danger: {
    background: "#fee2e2",
    color: "#991b1b",
  },
};

export default function StatusBadge({
  label,
  tone = "neutral",
}: StatusBadgeProps) {
  const style = toneStyles[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        background: style.background,
        color: style.color,
      }}
    >
      {label}
    </span>
  );
}