import { useEffect, useMemo, useState } from "react";
import { getPayments } from "../api/payments";
import EmptyState from "../components/ui/EmptyState";
import PageTitle from "../components/ui/PageTitle";
import SectionCard from "../components/ui/SectionCard";
import type { Payment } from "../types/payment";
import { formatDateTime } from "../utils/format";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [methodFilter, setMethodFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        setIsLoading(true);
        setError("");

        const params = methodFilter ? { method: methodFilter } : undefined;
        const data = await getPayments(params);
        setPayments(data);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.message ||
          "Αποτυχία φόρτωσης πληρωμών.";
        setError(String(message));
      } finally {
        setIsLoading(false);
      }
    }

    loadPayments();
  }, [methodFilter]);

  const stats = useMemo(() => {
    const totalAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    const methods = new Set(
      payments.map((payment) => payment.method).filter(Boolean)
    ).size;

    return {
      total: payments.length,
      totalAmount,
      methods,
    };
  }, [payments]);

  return (
    <div>
      <PageTitle
        title="Payments"
        subtitle="Παρακολούθηση πληρωμών ανά μαθητή και μέθοδο πληρωμής."
      />

      <div className="page-grid" style={{ marginBottom: "20px" }}>
        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Σύνολο πληρωμών
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {stats.total}
          </h3>
        </SectionCard>

        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Συνολικό ποσό
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {stats.totalAmount.toFixed(2)} €
          </h3>
        </SectionCard>

        <SectionCard>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Μέθοδοι πληρωμής
          </p>
          <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>
            {stats.methods}
          </h3>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="mobile-stack" style={{ marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0 }}>Payments List</h3>
            <p style={{ margin: "6px 0 0", color: "#64748b" }}>
              Φιλτράρισμα πληρωμών ανά μέθοδο.
            </p>
          </div>

          <input
            type="text"
            placeholder="π.χ. cash, card..."
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="responsive-input ui-input"
          />
        </div>

        {isLoading ? (
          <p style={{ color: "#64748b" }}>Φόρτωση πληρωμών...</p>
        ) : error ? (
          <EmptyState
            title="Δεν ήταν δυνατή η φόρτωση"
            description={error}
          />
        ) : payments.length === 0 ? (
          <EmptyState
            title="Δεν βρέθηκαν πληρωμές"
            description="Δεν υπάρχουν δεδομένα για το τρέχον φίλτρο."
          />
        ) : (
          <div className="table-wrapper responsive-input ui-input">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "880px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={thStyle}>Payment ID</th>
                  <th style={thStyle}>Student ID</th>
                  <th style={thStyle}>Ποσό</th>
                  <th style={thStyle}>Μέθοδος</th>
                  <th style={thStyle}>Ημερομηνία</th>
                  <th style={thStyle}>Σημειώσεις</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td style={tdStyle}>{payment.id}</td>
                    <td style={tdStyle}>{payment.student_id}</td>
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