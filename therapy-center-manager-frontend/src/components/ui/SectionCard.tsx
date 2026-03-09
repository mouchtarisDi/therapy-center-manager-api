import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
};

export default function SectionCard({ children }: SectionCardProps) {
  return <div className="section-card">{children}</div>;
}