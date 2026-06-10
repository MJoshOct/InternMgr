import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";
import { Users, CalendarCheck, Clock, Activity } from "lucide-react";

const statConfig = [
  {
    key: "totalInterns",
    label: "Total Interns",
    icon: Users,
    color: "#3b82f6",
    bg: "#eff6ff",
    to: "/interns",
  },
  {
    key: "todayAttendance",
    label: "Today's Attendance",
    icon: CalendarCheck,
    color: "#10b981",
    bg: "#ecfdf5",
    to: "/attendance",
  },
  {
    key: "pendingLeaves",
    label: "Pending Leaves",
    icon: Clock,
    color: "#f59e0b",
    bg: "#fffbeb",
    to: "/leave",
  },
  {
    key: "totalActivities",
    label: "Total Activities",
    icon: Activity,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    to: "/activities",
  },
];

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [dashRes, internsRes] = await Promise.all([
        API.get("/dashboard/admin"),
        API.get("/auth/interns"),
      ]);
      setDashboard(dashRes.data);
      setInterns(internsRes.data.interns || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
  const getAvatarColor = (name = "") =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div className="dash-main">
          <div className="dash-loading">Loading dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="dash-main">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-subtitle">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <div className="dash-avatar">AD</div>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          {statConfig.map(({ key, label, icon: Icon, color, bg, to }) => (
            <div
              className="stat-card stat-card-link"
              key={key}
              onClick={() => navigate(to)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(to)}
              title={`Go to ${label}`}
            >
              <div className="stat-icon" style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div className="stat-value">{dashboard[key] ?? 0}</div>
                <div className="stat-label">{label}</div>
              </div>
              <div className="stat-bar" style={{ background: color }} />
            </div>
          ))}
        </div>

        {/* Interns Table */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Interns</h2>
            <span className="badge">{interns.length} total</span>
          </div>

          {interns.length === 0 ? (
            <div className="empty-state">No interns registered yet.</div>
          ) : (
            <div className="table-wrap">
              <table className="intern-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {interns.map((intern) => (
                    <tr key={intern._id}>
                      <td>
                        <div className="intern-name-cell">
                          <div
                            className="avatar"
                            style={{ background: getAvatarColor(intern.name) }}
                          >
                            {getInitials(intern.name)}
                          </div>
                          <span className="intern-name">{intern.name}</span>
                        </div>
                      </td>
                      <td className="text-muted">{intern.email}</td>
                      <td>{intern.department || "—"}</td>
                      <td>{intern.role || "—"}</td>
                      <td>
                        <span className="status-chip status-active">Active</span>
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

export default AdminDashboard;
