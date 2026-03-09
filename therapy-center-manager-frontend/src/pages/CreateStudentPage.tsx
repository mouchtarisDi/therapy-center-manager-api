import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent } from "../api/students";
import PageTitle from "../components/ui/PageTitle";
import SectionCard from "../components/ui/SectionCard";

type FormState = {
  first_name: string;
  last_name: string;
  amka: string;
  birth_date: string;
  phone: string;
  address: string;
  guardian_full_name: string;
  guardian_phone: string;
  guardian_email: string;
  diagnosis_notes: string;
  assessment_expiry_date: string;
  approved_sessions: string;
  remaining_sessions: string;
  notes: string;
};

const initialForm: FormState = {
  first_name: "",
  last_name: "",
  amka: "",
  birth_date: "",
  phone: "",
  address: "",
  guardian_full_name: "",
  guardian_phone: "",
  guardian_email: "",
  diagnosis_notes: "",
  assessment_expiry_date: "",
  approved_sessions: "0",
  remaining_sessions: "0",
  notes: "",
};

export default function CreateStudentPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);

      const created = await createStudent({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        amka: form.amka.trim() || null,
        birth_date: form.birth_date || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        guardian_full_name: form.guardian_full_name.trim() || null,
        guardian_phone: form.guardian_phone.trim() || null,
        guardian_email: form.guardian_email.trim() || null,
        diagnosis_notes: form.diagnosis_notes.trim() || null,
        assessment_expiry_date: form.assessment_expiry_date || null,
        approved_sessions: Number(form.approved_sessions || 0),
        remaining_sessions: Number(form.remaining_sessions || 0),
        notes: form.notes.trim() || null,
      });

      navigate(`/students/${created.id}`);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Αποτυχία δημιουργίας μαθητή.";
      setError(String(message));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageTitle
        title="Create Student"
        subtitle="Καταχώριση νέου μαθητή στο ενεργό κέντρο."
      />

      <form onSubmit={handleSubmit}>
        <div className="page-grid-lg" style={{ marginBottom: "20px" }}>
          <SectionCard>
            <h3 style={{ marginTop: 0 }}>Βασικά στοιχεία</h3>

            <div style={formGridStyle}>
              <div>
                <label style={labelStyle}>Όνομα *</label>
                <input
                  className="ui-input"
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Επώνυμο *</label>
                <input
                  className="ui-input"
                  value={form.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>ΑΜΚΑ</label>
                <input
                  className="ui-input"
                  value={form.amka}
                  onChange={(e) => updateField("amka", e.target.value)}
                  maxLength={11}
                />
              </div>

              <div>
                <label style={labelStyle}>Ημερομηνία γέννησης</label>
                <input
                  type="date"
                  className="ui-input"
                  value={form.birth_date}
                  onChange={(e) => updateField("birth_date", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Τηλέφωνο</label>
                <input
                  className="ui-input"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Διεύθυνση</label>
                <input
                  className="ui-input"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h3 style={{ marginTop: 0 }}>Στοιχεία κηδεμόνα</h3>

            <div style={formGridStyle}>
              <div>
                <label style={labelStyle}>Ονοματεπώνυμο κηδεμόνα</label>
                <input
                  className="ui-input"
                  value={form.guardian_full_name}
                  onChange={(e) =>
                    updateField("guardian_full_name", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Τηλέφωνο κηδεμόνα</label>
                <input
                  className="ui-input"
                  value={form.guardian_phone}
                  onChange={(e) => updateField("guardian_phone", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Email κηδεμόνα</label>
                <input
                  type="email"
                  className="ui-input"
                  value={form.guardian_email}
                  onChange={(e) => updateField("guardian_email", e.target.value)}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="page-grid-lg" style={{ marginBottom: "20px" }}>
          <SectionCard>
            <h3 style={{ marginTop: 0 }}>Γνωμάτευση & συνεδρίες</h3>

            <div style={formGridStyle}>
              <div>
                <label style={labelStyle}>Λήξη γνωμάτευσης</label>
                <input
                  type="date"
                  className="ui-input"
                  value={form.assessment_expiry_date}
                  onChange={(e) =>
                    updateField("assessment_expiry_date", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Εγκεκριμένες συνεδρίες</label>
                <input
                  type="number"
                  min="0"
                  className="ui-input"
                  value={form.approved_sessions}
                  onChange={(e) =>
                    updateField("approved_sessions", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Υπόλοιπο συνεδριών</label>
                <input
                  type="number"
                  min="0"
                  className="ui-input"
                  value={form.remaining_sessions}
                  onChange={(e) =>
                    updateField("remaining_sessions", e.target.value)
                  }
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h3 style={{ marginTop: 0 }}>Σημειώσεις</h3>

            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Diagnosis notes</label>
                <textarea
                  className="ui-input"
                  rows={4}
                  value={form.diagnosis_notes}
                  onChange={(e) =>
                    updateField("diagnosis_notes", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Γενικές σημειώσεις</label>
                <textarea
                  className="ui-input"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard>
          {error ? (
            <p style={{ color: "crimson", marginTop: 0 }}>{error}</p>
          ) : null}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              className="ui-button-secondary"
              onClick={() => navigate("/students")}
            >
              Cancel
            </button>

            <button type="submit" className="ui-button" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Student"}
            </button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#334155",
};