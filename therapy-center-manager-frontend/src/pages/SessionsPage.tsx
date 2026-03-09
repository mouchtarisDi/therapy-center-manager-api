import { useEffect, useMemo, useState } from "react";
import { getSessions } from "../api/sessions";
import EmptyState from "../components/ui/EmptyState";
import PageTitle from "../components/ui/PageTitle";
import SectionCard from "../components/ui/SectionCard";
import StatusBadge from "../components/ui/StatusBadge";
import type { TherapySession, SessionStatus } from "../types/session";
import { formatDateTime } from "../utils/format";
import {
  getSessionStatusLabel,
  getSessionStatusTone,
} from "../utils/session";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSessions() {
      try {
        setIsLoading(true);
        setError("");

        const params = statusFilter
          ? { status: statusFilter as SessionStatus }
          : undefined;

        const data = await getSessions(params);
        setSessions(data);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.message ||
          "Αποτυχία φόρτωσης συνεδριών.";
        setError(String(message));
      } finally {
        setIsLoading(false);
      }
    }

    loadSessions();
  }, [statusFilter]);

  const stats = useMemo(() => {
    const scheduled = sessions.filter((s) => s.status === "SCHEDULED").length;
    const completed = sessions.filter((s) => s.status === "COMPLETED").length;
    const cancelled = sessions.filter((s) => s.status === "CANCELLED").length;

    return {
      total: sessions.length,
      scheduled,
      completed,
      cancelled,
    };
  }, [sessions]);

  return (
    <div>
      <PageTitle
        title="Sessions"
        subtitle="Παρακολούθηση προγραμματισμένων, ολοκληρωμένων και ακυρωμένων συνεδριών."
      />

      <div className="page-grid" style={{ marginBottom: "20px" }}>
        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Σύνολο συνεδριών
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {stats.total}
          </h3>
        </SectionCard>

        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Προγραμματισμένες
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {stats.scheduled}
          </h3>
        </SectionCard>

        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Ολοκληρωμένες
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {stats.completed}
          </h3>
        </SectionCard>

        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Ακυρωμένες
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {stats.cancelled}
          </h3>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="mobile-stack" style={{ marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0 }}>Sessions List</h3>
            <p style={{ margin: "6px 0 0", color: "#64748b" }}>
              Φιλτράρισμα συνεδριών ανά κατάσταση.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="responsive-input"
          >
            <option value="">Όλες οι καταστάσεις</option>
            <option value="SCHEDULED">Προγραμματισμένες</option>
            <option value="COMPLETED">Ολοκληρωμένες</option>
            <option value="CANCELLED">Ακυρωμένες</option>
          </select>
        </div>

        {isLoading ? (
          <p style={{ color: "#64748b" }}>Φόρτωση συνεδριών...</p>
        ) : error ? (
          <EmptyState
            title="Δεν ήταν δυνατή η φόρτωση"
            description={error}
          />
        ) : sessions.length === 0 ? (
          <EmptyState
            title="Δεν βρέθηκαν συνεδρίες"
            description="Δεν υπάρχουν δεδομένα για το τρέχον φίλτρο."
          />
        ) : (
          <div className="table-wrapper">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "900px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={thStyle}>Session ID</th>
                  <th style={thStyle}>Student ID</th>
                  <th style={thStyle}>Therapist ID</th>
                  <th style={thStyle}>Ημερομηνία & Ώρα</th>
                  <th style={thStyle}>Κατάσταση</th>
                  <th style={thStyle}>Σημειώσεις</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td style={tdStyle}>{session.id}</td>
                    <td style={tdStyle}>{session.student_id}</td>
                    <td style={tdStyle}>{session.therapist_user_id ?? "-"}</td>
                    <td style={tdStyle}>
                      {formatDateTime(session.scheduled_at)}
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge
                        label={getSessionStatusLabel(session.status)}
                        tone={getSessionStatusTone(session.status)}
                      />
                    </td>
                    <td style={tdStyle}>{session.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "14px 12px",
  fontSize: "13px",
  color: "#475569",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 12px",
  verticalAlign: "middle",
};