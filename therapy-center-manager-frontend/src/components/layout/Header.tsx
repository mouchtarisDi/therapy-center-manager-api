import { useAuth } from "../../context/AuthContext";
import { useCenter } from "../../context/CenterContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { centers, activeCenterId, setActiveCenterId } = useCenter();

  return (
    <header className="app-header">
      <div style={{ minWidth: 0 }}>
        <strong style={{ wordBreak: "break-word" }}>{user?.email ?? "User"}</strong>
      </div>

      <div className="app-header-right">
        <select
          value={activeCenterId ?? ""}
          onChange={(e) => setActiveCenterId(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            minWidth: "160px",
          }}
        >
          {centers.map((center) => (
            <option key={center.id} value={center.id}>
              {center.name}
            </option>
          ))}
        </select>

        <button
          onClick={logout}
          style={{
            border: "none",
            background: "#0f172a",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: "10px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}