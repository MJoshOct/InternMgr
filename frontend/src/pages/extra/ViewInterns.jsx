import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { Trash2, Search } from "lucide-react";
import "./AdminDashboard.css";
import "./ViewInterns.css";

function ViewInterns() {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await API.get("/auth/interns");
      setInterns(res.data.interns);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteIntern = async (id) => {
    if (!window.confirm("Are you sure you want to remove this intern?")) return;
    try {
      await API.delete(`/auth/intern/${id}`);
      setInterns((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      console.log(error);
      alert("Error deleting intern.");
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
  const getAvatarColor = (name = "") =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  const filtered = interns.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase()) ||
      i.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="dash-main">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Interns</h1>
            <p className="dash-subtitle">Manage all registered interns</p>
          </div>
          <div className="dash-avatar">AD</div>
        </div>

        {/* Section Card */}
        <div className="section-card">
          <div className="section-header" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h2 className="section-title">All Interns</h2>
              <span className="badge">{interns.length} total</span>
            </div>

            {/* Search */}
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
                          <div
                            className="avatar"
                            style={{ background: getAvatarColor(intern.name) }}
                          >
                            {getInitials(intern.name)}
                          </div>
                          <div>
                            <div className="intern-name">{intern.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{intern.email}</td>
                      <td>{intern.department || "—"}</td>
                      <td>{intern.role || "—"}</td>
                      <td>
                        <span className="status-chip status-active">Active</span>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteIntern(intern._id)}
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
        </div>
      </div>
    </div>
  );
}

export default ViewInterns;
