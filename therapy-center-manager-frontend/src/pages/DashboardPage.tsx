import { useEffect, useMemo, useState } from "react";
import { getPayments } from "../api/payments";
import { getSessions } from "../api/sessions";
import { getStudents } from "../api/students";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";
import PageTitle from "../components/ui/PageTitle";
import type { Payment } from "../types/payment";
import type { TherapySession } from "../types/session";
import type { Student } from "../types/student";
import { isExpired } from "../utils/format";
import { useCenter } from "../context/CenterContext";

export default function DashboardPage() {
  const { activeCenterId } = useCenter();

  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError("");

        const [studentsData, sessionsData, paymentsData] = await Promise.all([
          getStudents(),
          getSessions(),
          getPayments(),
        ]);

        setStudents(studentsData);
        setSessions(sessionsData);
        setPayments(paymentsData);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.message ||
          "Αποτυχία φόρτωσης dashboard.";
        setError(String(message));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [activeCenterId]);

  const stats = useMemo(() => {
    const expiredAssessments = students.filter((student) =>
      isExpired(student.assessment_expiry_date)
    ).length;

    const scheduledSessions = sessions.filter(
      (session) => session.status === "SCHEDULED"
    ).length;

    const completedSessions = sessions.filter(
      (session) => session.status === "COMPLETED"
    ).length;

    const cancelledSessions = sessions.filter(
      (session) => session.status === "CANCELLED"
    ).length;

    const totalPaymentsAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    return {
      studentsCount: students.length,
      expiredAssessments,
      scheduledSessions,
      completedSessions,
      cancelledSessions,
      paymentsCount: payments.length,
      totalPaymentsAmount,
    };
  }, [students, sessions, payments]);

  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="Γενική εικόνα του κέντρου με βασικά στατιστικά και σύνοψη δεδομένων."
      />

      {isLoading ? (
        <SectionCard>
          <p style={{ color: "#64748b", margin: 0 }}>
            Φόρτωση δεδομένων dashboard...
          </p>
        </SectionCard>
      ) : error ? (
        <EmptyState title="Δεν ήταν δυνατή η φόρτωση" description={error} />
      ) : (
        <>
          <div className="page-grid" style={{ marginBottom: "20px" }}>
            <SectionCard>
              <p style={labelStyle}>Μαθητές</p>
              <h3 style={valueStyle}>{stats.studentsCount}</h3>
            </SectionCard>

            <SectionCard>
              <p style={labelStyle}>Ληγμένες γνωματεύσεις</p>
              <h3 style={valueStyle}>{stats.expiredAssessments}</h3>
            </SectionCard>

            <SectionCard>
              <p style={labelStyle}>Προγραμματισμένες συνεδρίες</p>
              <h3 style={valueStyle}>{stats.scheduledSessions}</h3>
            </SectionCard>

            <SectionCard>
              <p style={labelStyle}>Ολοκληρωμένες συνεδρίες</p>
              <h3 style={valueStyle}>{stats.completedSessions}</h3>
            </SectionCard>

            <SectionCard>
              <p style={labelStyle}>Ακυρωμένες συνεδρίες</p>
              <h3 style={valueStyle}>{stats.cancelledSessions}</h3>
            </SectionCard>

            <SectionCard>
              <p style={labelStyle}>Συνολικό ποσό πληρωμών</p>
              <h3 style={valueStyle}>
                {stats.totalPaymentsAmount.toFixed(2)} €
              </h3>
            </SectionCard>
          </div>

          <div className="page-grid-lg">
            <SectionCard>
              <h3 style={{ marginTop: 0 }}>Σύνοψη κέντρου</h3>
              <p style={summaryTextStyle}>
                Το ενεργό center είναι:{" "}
                <strong>{activeCenterId ? `#${activeCenterId}` : "-"}</strong>
              </p>
              <p style={summaryTextStyle}>
                Υπάρχουν <strong>{stats.studentsCount}</strong> μαθητές στο
                τρέχον κέντρο.
              </p>
              <p style={summaryTextStyle}>
                Οι ληγμένες γνωματεύσεις είναι{" "}
                <strong>{stats.expiredAssessments}</strong>.
              </p>
              <p style={summaryTextStyle}>
                Οι συνολικές πληρωμές είναι <strong>{stats.paymentsCount}</strong>{" "}
                με συνολικό ποσό{" "}
                <strong>{stats.totalPaymentsAmount.toFixed(2)} €</strong>.
              </p>
            </SectionCard>

            <SectionCard>
              <h3 style={{ marginTop: 0 }}>Σύνοψη συνεδριών</h3>
              <p style={summaryTextStyle}>
                Προγραμματισμένες: <strong>{stats.scheduledSessions}</strong>
              </p>
              <p style={summaryTextStyle}>
                Ολοκληρωμένες: <strong>{stats.completedSessions}</strong>
              </p>
              <p style={summaryTextStyle}>
                Ακυρωμένες: <strong>{stats.cancelledSessions}</strong>
              </p>
              <p style={summaryTextStyle}>
                Το dashboard πλέον τραβά πραγματικά δεδομένα από το backend σου.
              </p>
            </SectionCard>
          </div>
        </>
      )}
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