import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main-area">
        <Header />
        <main className="app-page">{children}</main>
      </div>
    </div>
  );
}