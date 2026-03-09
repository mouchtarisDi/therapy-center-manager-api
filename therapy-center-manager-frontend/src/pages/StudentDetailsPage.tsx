import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPayments } from "../api/payments";
import { getSessions } from "../api/sessions";
import { getStudentById } from "../api/students";
import EmptyState from "../components/ui/EmptyState";
import PageTitle from "../components/ui/PageTitle";
import SectionCard from "../components/ui/SectionCard";
import StatusBadge from "../components/ui/StatusBadge";
import type { Payment } from "../types/payment";
import type { TherapySession } from "../types/session";
import type { Student } from "../types/student";
import { formatDate, formatDateTime, isExpired } from "../utils/format";
import {
  getSessionStatusLabel,
  getSessionStatusTone,
} from "../utils/session";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const studentId = Number(id);

  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudentDetails() {
      if (!studentId || Number.isNaN(studentId)) {
        setError("Μη έγκυρο student id.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [studentData, sessionsData, paymentsData] = await Promise.all([
          getStudentById(studentId),
          getSessions({ student_id: studentId }),
          getPayments({ student_id: studentId }),
        ]);

        setStudent(studentData);
        setSessions(sessionsData);
        setPayments(paymentsData);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.message ||
          "Αποτυχία φόρτωσης στοιχείων μαθητή.";
        setError(String(message));
      } finally {
        setIsLoading(false);
      }
    }

    loadStudentDetails();
  }, [studentId]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [payments]);

  if (isLoading) {
    return (
      <div>
        <PageTitle title="Student Details" subtitle="Φόρτωση στοιχείων μαθητή..." />
        <SectionCard>
          <p style={{ margin: 0, color: "#64748b" }}>Φόρτωση...</p>
        </SectionCard>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        <PageTitle title="Student Details" subtitle="Δεν ήταν δυνατή η φόρτωση." />
        <EmptyState
          title="Σφάλμα φόρτωσης"
          description={error || "Ο μαθητής δεν βρέθηκε."}
        />
      </div>
    );
  }

  const expired = isExpired(student.assessment_expiry_date);

  return (
    <div>
      <PageTitle
        title={`${student.first_name} ${student.last_name}`}
        subtitle="Αναλυτική προβολή στοιχείων μαθητή, συνεδριών και πληρωμών."
      />

      <div className="page-grid" style={{ marginBottom: "20px" }}>
        <SectionCard>
          <p style={labelStyle}>Approved Sessions</p>
          <h3 style={valueStyle}>{student.approved_sessions}</h3>
        </SectionCard>

        <SectionCard>
          <p style={labelStyle}>Remaining Sessions</p>
          <h3 style={valueStyle}>{student.remaining_sessions}</h3>
        </SectionCard>

        <SectionCard>
          <p style={labelStyle}>Payments</p>
          <h3 style={valueStyle}>{payments.length}</h3>
        </SectionCard>

        <SectionCard>
          <p style={labelStyle}>Total Paid</p>
          <h3 style={valueStyle}>{totalPaid.toFixed(2)} €</h3>
        </SectionCard>
      </div>

      <div className="page-grid-lg" style={{ marginBottom: "20px" }}>
        <SectionCard>
          <h3 style={{ marginTop: 0 }}>Βασικά στοιχεία</h3>

          <div style={detailsGridStyle}>
            <DetailItem label="ID" value={String(student.id)} />
            <DetailItem label="ΑΜΚΑ" value={student.amka || "-"} />
            <DetailItem label="Ημ. γέννησης" value={formatDate(student.birth_date)} />
            <DetailItem label="Τηλέφωνο" value={student.phone || "-"} />
            <DetailItem label="Διεύθυνση" value={student.address || "-"} />
            <DetailItem
              label="Κηδεμόνας"
              value={student.guardian_full_name || "-"}
            />
            <DetailItem
              label="Τηλέφωνο κηδεμόνα"
              value={student.guardian_phone || "-"}
            />
            <DetailItem
              label="Email κηδεμόνα"
              value={student.guardian_email || "-"}
            />
            <DetailItem
              label="Λήξη γνωμάτευσης"
              value={formatDate(student.assessment_expiry_date)}
            />
            <div>
              <p style={detailLabelStyle}>Κατάσταση γνωμάτευσης</p>
              {expired ? (
                <StatusBadge label="Ληγμένη" tone="danger" />
              ) : (
                <StatusBadge label="Ενεργή" tone="success" />
              )}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p style={detailLabelStyle}>Σημειώσεις</p>
            <p style={detailValueStyle}>{student.notes || "-"}</p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p style={detailLabelStyle}>Diagnosis Notes</p>
            <p style={detailValueStyle}>{student.diagnosis_notes || "-"}</p>
          </div>
        </SectionCard>

        <SectionCard>
          <h3 style={{ marginTop: 0 }}>Σύνοψη μαθητή</h3>
          <p style={summaryTextStyle}>
            Ο μαθητής έχει <strong>{student.approved_sessions}</strong> εγκεκριμένες
            συνεδρίες και <strong>{student.remaining_sessions}</strong> διαθέσιμες.
          </p>
          <p style={summaryTextStyle}>
            Έχουν καταγραφεί <strong>{sessions.length}</strong> συνεδρίες και{" "}
            <strong>{payments.length}</strong> πληρωμές.
          </p>
          <p style={summaryTextStyle}>
            Το συνολικό ποσό πληρωμών είναι <strong>{totalPaid.toFixed(2)} €</strong>.
          </p>
          <p style={summaryTextStyle}>
            Η γνωμάτευση είναι{" "}
            <strong>{expired ? "ληγμένη" : "ενεργή"}</strong>.
          </p>
        </SectionCard>
      </div>

      <SectionCard>
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Συνεδρίες μαθητή</h3>

        {sessions.length === 0 ? (
          <EmptyState
            title="Δεν υπάρχουν συνεδρίες"
            description="Δεν βρέθηκαν συνεδρίες για τον συγκεκριμένο μαθητή."
          />
        ) : (
          <div className="table-wrapper">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "760px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={thStyle}>Session ID</th>
                  <th style={thStyle}>Ημερομηνία & Ώρα</th>
                  <th style={thStyle}>Therapist ID</th>
                  <th style={thStyle}>Κατάσταση</th>
                  <th style={thStyle}>Σημειώσεις</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{session.id}</td>
                    <td style={tdStyle}>{formatDateTime(session.scheduled_at)}</td>
                    <td style={tdStyle}>{session.therapist_user_id ?? "-"}</td>
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

      <div style={{ height: "20px" }} />

      <SectionCard>
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Πληρωμές μαθητή</h3>

        {payments.length === 0 ? (
          <EmptyState
            title="Δεν υπάρχουν πληρωμές"
            description="Δεν βρέθηκαν πληρωμές για τον συγκεκριμένο μαθητή."
          />
        ) : (
          <div className="table-wrapper">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "760px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={thStyle}>Payment ID</th>
                  <th style={thStyle}>Ποσό</th>
                  <th style={thStyle}>Μέθοδος</th>
                  <th style={thStyle}>Ημερομηνία</th>
                  <th style={thStyle}>Σημειώσεις</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{payment.id}</td>
                    <td style={tdStyle}>{Number(payment.amount).toFixed(2)} €</td>
                    <td style={tdStyle}>{payment.method || "-"}</td>
                    <td style={tdStyle}>{formatDateTime(payment.paid_at)}</td>
                    <td style={tdStyle}>{payment.notes || "-"}</td>
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={detailLabelStyle}>{label}</p>
      <p style={detailValueStyle}>{value}</p>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const valueStyle: React.CSSProperties = {
  margin: "10px 0 0",
  fontSize: "28px",
};

const summaryTextStyle: React.CSSProperties = {
  color: "#475569",
  margin: "0 0 12px",
  lineHeight: 1.6,
};

const detailsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const detailLabelStyle: React.CSSProperties = {
  margin: "0 0 6px",
  color: "#64748b",
  fontSize: "13px",
};

const detailValueStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  lineHeight: 1.5,
};

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