import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { Trash2, Search, UserPlus, Users, Eye, EyeOff } from "lucide-react";
import "./AdminDashboard.css";
import "./ManageInterns.css";

// ─── helpers ────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const AVATAR_COLORS = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4"];
const getAvatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─── Tab bar ─────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { key: "view", label: "View Interns", icon: Users },
    { key: "add",  label: "Add Intern",   icon: UserPlus },
  ];
  return (
    <div style={ts.tabBar}>
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          style={{ ...ts.tab, ...(active === key ? ts.tabActive : {}) }}
          onClick={() => onChange(key)}
        >
          <Icon size={15} />
          {label}
          {active === key && <div style={ts.tabUnderline} />}
        </button>
      ))}
    </div>
  );
}

// ─── View tab ────────────────────────────────────────────────
function ViewTab({ interns, loading, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = interns.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase()) ||
      i.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="section-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 className="section-title">All Interns</h2>
          <span className="badge">{interns.length} total</span>
        </div>
        <div className="search-box">
          <Search size={14} color="#94a3b8" />
          <input
            className="search-input"
            placeholder="Search by name, email, dept…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="dash-loading">Loading interns…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {search ? "No interns match your search." : "No interns registered yet."}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="intern-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((intern, index) => (
                <tr key={intern._id}>
                  <td className="text-muted">{index + 1}</td>
                  <td>
                    <div className="intern-name-cell">
                      <div className="avatar" style={{ background: getAvatarColor(intern.name) }}>
                        {getInitials(intern.name)}
                      </div>
                      <div className="intern-name">{intern.name}</div>
                    </div>
                  </td>
                  <td className="text-muted">{intern.email}</td>
                  <td>{intern.department || "—"}</td>
                  <td>{intern.role || "—"}</td>
                  <td><span className="status-chip status-active">Active</span></td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(intern._id)}
                      title="Remove intern"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Add tab ─────────────────────────────────────────────────
function AddTab({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", department: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required."); return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register-intern", form);
      setSuccess(`${form.name} has been added successfully.`);
      setForm({ name: "", email: "", department: "", password: "" });
      onSuccess(); // refresh the list
    } catch (err) {
      setError(err?.response?.data?.message || "Error adding intern. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name",       label: "Full Name",   type: "text",     placeholder: "e.g. Rahul Sharma" },
    { key: "email",      label: "Email",        type: "email",    placeholder: "e.g. rahul@example.com" },
    { key: "department", label: "Department",   type: "text",     placeholder: "e.g. Engineering" },
    { key: "password",   label: "Password",     type: showPass ? "text" : "password", placeholder: "Min. 8 characters" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={ts.formGrid}>
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key} style={ts.formGroup}>
            <label style={ts.formLabel}>{label}</label>
            <div style={{ position: "relative" }}>
              <input
                type={type}
                className="form-input"
                placeholder={placeholder}
                value={form[key]}
                onChange={set(key)}
              />
              {key === "password" && (
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {error   && <div style={ts.alertError}>{error}</div>}
      {success && <div style={ts.alertSuccess}>{success}</div>}

      <div style={ts.formActions}>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          <UserPlus size={14} />
          {loading ? "Adding…" : "Add Intern"}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────
function ManageInterns() {
  const [tab, setTab]       = useState("view");
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInterns(); }, []);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await API.get("/auth/interns");
      setInterns(res.data.interns);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteIntern = async (id) => {
    if (!window.confirm("Remove this intern?")) return;
    try {
      await API.delete(`/auth/intern/${id}`);
      setInterns((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert("Error deleting intern.");
    }
  };

  // When a new intern is added, refresh list and switch to view tab
  const handleAddSuccess = () => {
    fetchInterns();
    setTab("view");
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="dash-main">
        {/* Page header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Manage Interns</h1>
            <p className="dash-subtitle">View, search and add interns</p>
          </div>
          <div className="dash-avatar">AD</div>
        </div>

        {/* Section card with tab bar inside */}
        <div className="section-card">
          <TabBar active={tab} onChange={setTab} />

          {tab === "view" && (
            <ViewTab
              interns={interns}
              loading={loading}
              onDelete={deleteIntern}
            />
          )}

          {tab === "add" && (
            <AddTab onSuccess={handleAddSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageInterns;

// ─── Tab styles (inline — no new CSS classes) ────────────────
const ts = {
  tabBar: {
    display: "flex",
    borderBottom: "1px solid #f1f5f9",
    padding: "0 24px",
    gap: "0",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "14px 18px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#94a3b8",
    cursor: "pointer",
    position: "relative",
    fontFamily: "inherit",
    transition: "color 0.15s",
    marginBottom: "-1px",
  },
  tabActive: {
    color: "#0f172a",
    borderBottomColor: "#3b82f6",
  },
  tabUnderline: {}, // handled by borderBottomColor above
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  formLabel: {
    fontSize: "0.72rem",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  alertError: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "0.82rem",
    padding: "10px 14px",
    marginBottom: "16px",
  },
  alertSuccess: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: "0.82rem",
    padding: "10px 14px",
    marginBottom: "16px",
  },
};
