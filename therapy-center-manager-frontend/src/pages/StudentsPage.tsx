import { useEffect, useMemo, useState } from "react";
import { getStudents } from "../api/students";
import EmptyState from "../components/ui/EmptyState";
import PageTitle from "../components/ui/PageTitle";
import SectionCard from "../components/ui/SectionCard";
import StatusBadge from "../components/ui/StatusBadge";
import type { Student } from "../types/student";
import { formatDate, isExpired } from "../utils/format";
import { Link } from "react-router-dom";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    async function loadStudents() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getStudents(search || undefined);
        setStudents(data);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.message ||
          "Αποτυχία φόρτωσης μαθητών.";
        setError(String(message));
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, [search]);

  const totalStudents = students.length;

  const expiredCount = useMemo(() => {
    return students.filter((student) =>
      isExpired(student.assessment_expiry_date)
    ).length;
  }, [students]);

  return (
    <div>
      <PageTitle
        title="Students"
        subtitle="Διαχείριση μαθητών, γνωματεύσεων και διαθέσιμων συνεδριών."
      />

      <div className="page-grid" style={{ marginBottom: "20px" }}>
        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Σύνολο μαθητών
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {totalStudents}
          </h3>
        </SectionCard>

        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Ληγμένες γνωματεύσεις
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {expiredCount}
          </h3>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="mobile-stack" style={{ marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0 }}>Students List</h3>
            <p style={{ margin: "6px 0 0", color: "#64748b" }}>
              Αναζήτηση με όνομα, επώνυμο ή άλλο πεδίο που υποστηρίζει το backend.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Αναζήτηση μαθητή..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="responsive-input ui-input"
            />

            <Link
              to="/students/new"
              className="ui-button"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              New Student
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p style={{ color: "#64748b" }}>Φόρτωση μαθητών...</p>
        ) : error ? (
          <EmptyState
            title="Δεν ήταν δυνατή η φόρτωση"
            description={error}
          />
        ) : students.length === 0 ? (
          <EmptyState
            title="Δεν βρέθηκαν μαθητές"
            description="Δοκίμασε άλλη αναζήτηση ή πρόσθεσε μαθητές στο backend."
          />
        ) : (
          <div className="table-wrapper">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "980px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={thStyle}>Ονοματεπώνυμο</th>
                  <th style={thStyle}>ΑΜΚΑ</th>
                  <th style={thStyle}>Κηδεμόνας</th>
                  <th style={thStyle}>Τηλέφωνο</th>
                  <th style={thStyle}>Εγκεκριμένες</th>
                  <th style={thStyle}>Υπόλοιπο</th>
                  <th style={thStyle}>Λήξη γνωμάτευσης</th>
                  <th style={thStyle}>Κατάσταση</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const expired = isExpired(student.assessment_expiry_date);

                  return (
                    <tr
                      key={student.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: expired ? "#fff7f7" : "#ffffff",
                      }}
                    >
                      <td style={tdStyle}>
                        <Link
                          to={`/students/${student.id}`}
                          style={{
                            fontWeight: 600,
                            color: "#0f172a",
                            textDecoration: "none",
                          }}
                        >
                          {student.first_name} {student.last_name}
                        </Link>
                        <div style={{ color: "#64748b", fontSize: "13px" }}>
                          ID: {student.id}
                        </div>
                      </td>

                      <td style={tdStyle}>{student.amka || "-"}</td>
                      <td style={tdStyle}>
                        {student.guardian_full_name || "-"}
                      </td>
                      <td style={tdStyle}>
                        {student.guardian_phone || student.phone || "-"}
                      </td>
                      <td style={tdStyle}>{student.approved_sessions}</td>
                      <td style={tdStyle}>{student.remaining_sessions}</td>
                      <td style={tdStyle}>
                        {formatDate(student.assessment_expiry_date)}
                      </td>
                      <td style={tdStyle}>
                        {expired ? (
                          <StatusBadge label="Ληγμένη" tone="danger" />
                        ) : (
                          <StatusBadge label="Ενεργή" tone="success" />
                        )}
                      </td>
                    </tr>
                  );
                })}
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