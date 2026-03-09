import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <h2 style={{ marginTop: 0, fontSize: "20px", marginBottom: "20px" }}>
        Therapy Manager
      </h2>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Students
        </NavLink>

        <NavLink
          to="/sessions"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Sessions
        </NavLink>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Payments
        </NavLink>
      </nav>
    </aside>
  );
}