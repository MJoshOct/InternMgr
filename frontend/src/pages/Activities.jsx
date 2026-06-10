import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import "./Activities.css";
import { Search, Plus, Trash2, CheckCircle, Clock, Calendar, Users, X } from "lucide-react";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const TYPE_OPTIONS = ["Task", "Assignment", "Project", "Training", "Other"];

function Activities() {
  const [tab, setTab] = useState("all");
  const [activities, setActivities] = useState([]);
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [internSearch, setInternSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Task",
    priority: "Medium",
    deadline: "",
    assignedTo: [],
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [actRes, internRes] = await Promise.all([
        API.get("/activity/all"),
        API.get("/auth/interns"),
      ]);
      setActivities(actRes.data.activities || []);
      setInterns(internRes.data.interns || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleIntern = (id) => {
    setForm((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(id)
        ? prev.assignedTo.filter((i) => i !== id)
        : [...prev.assignedTo, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return showToast("Title is required", "error");
    if (!form.deadline) return showToast("Deadline is required", "error");
    if (form.assignedTo.length === 0) return showToast("Assign to at least one intern", "error");

    setSubmitting(true);
    try {
      await API.post("/activity/create", form);
      showToast("Activity created and assigned!");
      setForm({ title: "", description: "", type: "Task", priority: "Medium", deadline: "", assignedTo: [] });
      setTab("all");
      fetchAll();
    } catch (err) {
      showToast("Failed to create activity", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await API.delete(`/activity/${id}`);
      setActivities((prev) => prev.filter((a) => a._id !== id));
      showToast("Activity deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const filtered = activities.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.activity?.toLowerCase().includes(q) ||
      a.title?.toLowerCase().includes(q) ||
      a.internId?.name?.toLowerCase().includes(q) ||
      a.type?.toLowerCase().includes(q)
    );
  });

  const priorityClass = (p) =>
    ({ Low: "priority-low", Medium: "priority-med", High: "priority-high" }[p] || "priority-med");

  const typeClass = (t) =>
    ({ Task: "type-task", Assignment: "type-assign", Project: "type-project", Training: "type-train", Other: "type-other" }[t] || "type-other");

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="act-main">

        {/* Toast */}
        {toast && (
          <div className={`act-toast ${toast.type === "error" ? "act-toast-error" : ""}`}>
            {toast.type === "success" ? <CheckCircle size={15} /> : <X size={15} />}
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="act-header">
          <div>
            <h1 className="act-title">Activities</h1>
            <p className="act-subtitle">Manage and assign daily tasks to interns</p>
          </div>
          <button className="act-new-btn" onClick={() => setTab("create")}>
            <Plus size={15} /> New Activity
          </button>
        </div>

        {/* Tabs */}
        <div className="act-tabs">
          <button
            className={`act-tab${tab === "all" ? " active" : ""}`}
            onClick={() => setTab("all")}
          >
            All Activities
            <span className="act-tab-count">{activities.length}</span>
          </button>
          <button
            className={`act-tab${tab === "create" ? " active" : ""}`}
            onClick={() => setTab("create")}
          >
            <Plus size={13} /> Create &amp; Assign
          </button>
        </div>

        {/* ── TAB: ALL ACTIVITIES ── */}
        {tab === "all" && (
          <div className="act-panel">
            {/* Search */}
            <div className="act-search-row">
              <div className="act-search-wrap">
                <Search size={15} className="act-search-icon" />
                <input
                  className="act-search"
                  placeholder="Search by title, intern, or type…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <span className="act-count-label">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {loading ? (
              <div className="act-empty">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="act-empty">No activities found.</div>
            ) : (
              <div className="act-table-wrap">
                <table className="act-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title / Activity</th>
                      <th>Intern</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Deadline</th>
                      <th>Submitted</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a, i) => (
                      <tr key={a._id} className="act-tr-clickable" onClick={() => setSelectedActivity(a)}>
                        <td className="act-num">{i + 1}</td>
                        <td>
                          <div className="act-title-cell">
                            <span className="act-row-title">{a.title || a.activity}</span>
                            {a.description && (
                              <span className="act-row-desc">{a.description}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="act-intern-cell">
                            <div className="act-avatar">{(a.internId?.name || "?")[0].toUpperCase()}</div>
                            <div>
                              <div className="act-intern-name">{a.internId?.name || "—"}</div>
                              <div className="act-intern-email">{a.internId?.email || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`act-chip ${typeClass(a.type)}`}>{a.type || "Task"}</span></td>
                        <td><span className={`act-chip ${priorityClass(a.priority)}`}>{a.priority || "Medium"}</span></td>
                        <td>
                          {a.deadline ? (
                            <div className="act-deadline">
                              <Calendar size={12} />
                              {new Date(a.deadline).toLocaleDateString("en-IN")}
                            </div>
                          ) : "—"}
                        </td>
                        <td className="act-date">{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                        <td>
                          <button className="act-del-btn" onClick={(e) => { e.stopPropagation(); handleDelete(a._id); }} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: CREATE & ASSIGN ── */}
        {tab === "create" && (
          <div className="act-panel">
            <div className="act-form-grid">

              {/* Left: Form */}
              <div className="act-form-left">
                <h3 className="act-form-section-title">Activity Details</h3>

                <div className="act-field">
                  <label className="act-label">Title <span className="act-required">*</span></label>
                  <input
                    className="act-input"
                    placeholder="e.g. Build REST API for user module"
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                  />
                </div>

                <div className="act-field">
                  <label className="act-label">Description</label>
                  <textarea
                    className="act-input act-textarea"
                    placeholder="Describe the activity, expected output, and any resources…"
                    value={form.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Type MCQ */}
                <div className="act-field">
                  <label className="act-label">Type <span className="act-required">*</span></label>
                  <div className="act-mcq-group">
                    {TYPE_OPTIONS.map((t) => (
                      <button
                        key={t}
                        className={`act-mcq-btn${form.type === t ? " selected" : ""}`}
                        onClick={() => handleFormChange("type", t)}
                        type="button"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority MCQ */}
                <div className="act-field">
                  <label className="act-label">Priority <span className="act-required">*</span></label>
                  <div className="act-mcq-group">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p}
                        className={`act-mcq-btn act-mcq-priority-${p.toLowerCase()}${form.priority === p ? " selected" : ""}`}
                        onClick={() => handleFormChange("priority", p)}
                        type="button"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="act-field">
                  <label className="act-label">Deadline <span className="act-required">*</span></label>
                  <div className="act-input-icon-wrap">
                    <Clock size={14} className="act-input-icon" />
                    <input
                      className="act-input act-input-with-icon"
                      type="date"
                      value={form.deadline}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => handleFormChange("deadline", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Assign Interns */}
              <div className="act-form-right">
                <div className="act-assign-header">
                  <h3 className="act-form-section-title">Assign To</h3>
                  <span className="act-assign-count">
                    <Users size={13} /> {form.assignedTo.length} selected
                  </span>
                </div>

                {/* Intern Search */}
                <div className="act-intern-search-wrap">
                  <Search size={13} className="act-intern-search-icon" />
                  <input
                    className="act-input act-intern-search"
                    placeholder="Search by name, email or department…"
                    value={internSearch}
                    onChange={(e) => setInternSearch(e.target.value)}
                  />
                </div>

                {interns.length === 0 ? (
                  <div className="act-empty-small">No interns found.</div>
                ) : (
                  <div className="act-intern-list">
                    {interns
                      .filter((intern) => {
                        const q = internSearch.toLowerCase();
                        return (
                          intern.name?.toLowerCase().includes(q) ||
                          intern.email?.toLowerCase().includes(q) ||
                          intern.department?.toLowerCase().includes(q)
                        );
                      })
                      .map((intern) => {
                        const selected = form.assignedTo.includes(intern._id);
                        return (
                          <div
                            key={intern._id}
                            className={`act-intern-row${selected ? " selected" : ""}`}
                            onClick={() => toggleIntern(intern._id)}
                          >
                            <div className="act-intern-check">
                              {selected && <CheckCircle size={15} />}
                            </div>
                            <div className="act-avatar act-avatar-sm">
                              {(intern.name || "?")[0].toUpperCase()}
                            </div>
                            <div className="act-intern-info">
                              <span className="act-intern-name">{intern.name}</span>
                              <span className="act-intern-email">{intern.email}</span>
                            </div>
                            {intern.department && (
                              <span className="act-intern-dept">{intern.department}</span>
                            )}
                          </div>
                        );
                      })}
                    {interns.filter((intern) => {
                      const q = internSearch.toLowerCase();
                      return (
                        intern.name?.toLowerCase().includes(q) ||
                        intern.email?.toLowerCase().includes(q) ||
                        intern.department?.toLowerCase().includes(q)
                      );
                    }).length === 0 && (
                      <div className="act-empty-small">No interns match your search.</div>
                    )}
                  </div>
                )}

                <button
                  className="act-submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Creating…" : "Create & Assign Activity"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Activity Detail Modal ── */}
        {selectedActivity && (
          <div className="act-modal-overlay" onClick={() => setSelectedActivity(null)}>
            <div className="act-modal" onClick={(e) => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="act-modal-header">
                <div className="act-modal-chips">
                  <span className={`act-chip ${typeClass(selectedActivity.type)}`}>{selectedActivity.type || "Task"}</span>
                  <span className={`act-chip ${priorityClass(selectedActivity.priority)}`}>{selectedActivity.priority || "Medium"}</span>
                </div>
                <button className="act-modal-close" onClick={() => setSelectedActivity(null)}>
                  <X size={16} />
                </button>
              </div>

              {/* Title */}
              <h2 className="act-modal-title">{selectedActivity.title || selectedActivity.activity}</h2>

              {/* Description */}
              {selectedActivity.description && (
                <p className="act-modal-desc">{selectedActivity.description}</p>
              )}

              <div className="act-modal-divider" />

              {/* Meta Grid */}
              <div className="act-modal-meta">
                <div className="act-modal-meta-item">
                  <span className="act-modal-meta-label">Assigned To</span>
                  <div className="act-intern-cell" style={{ marginTop: 6 }}>
                    <div className="act-avatar">{(selectedActivity.internId?.name || "?")[0].toUpperCase()}</div>
                    <div>
                      <div className="act-intern-name">{selectedActivity.internId?.name || "—"}</div>
                      <div className="act-intern-email">{selectedActivity.internId?.email || ""}</div>
                    </div>
                  </div>
                </div>

                <div className="act-modal-meta-item">
                  <span className="act-modal-meta-label">Deadline</span>
                  <div className="act-modal-meta-val">
                    <Calendar size={13} />
                    {selectedActivity.deadline
                      ? new Date(selectedActivity.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                      : "No deadline set"}
                  </div>
                </div>

                <div className="act-modal-meta-item">
                  <span className="act-modal-meta-label">Submitted On</span>
                  <div className="act-modal-meta-val">
                    <Clock size={13} />
                    {new Date(selectedActivity.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>

                {selectedActivity.internId?.department && (
                  <div className="act-modal-meta-item">
                    <span className="act-modal-meta-label">Department</span>
                    <div className="act-modal-meta-val">{selectedActivity.internId.department}</div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="act-modal-footer">
                <button
                  className="act-modal-del-btn"
                  onClick={() => { handleDelete(selectedActivity._id); setSelectedActivity(null); }}
                >
                  <Trash2 size={14} /> Delete Activity
                </button>
                <button className="act-modal-close-btn" onClick={() => setSelectedActivity(null)}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Activities;
