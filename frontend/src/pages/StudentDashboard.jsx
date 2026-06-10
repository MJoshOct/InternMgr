import { useEffect, useState } from "react";
import API from "../services/api";
import StudentSidebar from "../components/StudentSidebar";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [data, setData] = useState({});
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Intern";
  const firstName = userName.split(" ")[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const internId = localStorage.getItem("internId");
    try {
      const [dashRes, attRes, leaveRes] = await Promise.all([
        API.get(`/dashboard/student/${internId}`),
        API.get(`/attendance/history/${internId}`),
        API.get(`/leave/my/${internId}`),
      ]);
      setData(dashRes.data);
      setRecentAttendance((attRes.data.attendance || []).slice(0, 5));
      setRecentLeaves((leaveRes.data.leaves || []).slice(0, 3));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const todayMarked = recentAttendance.some((a) => {
    return new Date(a.date).toDateString() === new Date().toDateString();
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  if (loading) {
    return (
      <div className="app-shell">
        <StudentSidebar />
        <div className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <StudentSidebar />
      <div className="main-content">
        <div className="topbar">
          <h2>Dashboard</h2>
          <div className="topbar-right">
            <span className="text-muted" style={{ fontSize: "0.82rem" }}>{today}</span>
            <span className="badge-notif">Intern</span>
          </div>
        </div>

        <div className="page-content">

          {/* Greeting */}
          <div className="page-header">
            <div>
              <h2>{getGreeting()}, {firstName}! 👋</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                {todayMarked ? "You've marked attendance today. Keep it up!" : "You haven't marked attendance yet today."}
              </p>
            </div>
            {!todayMarked && (
              <button className="btn btn-auto" onClick={() => navigate("/student/mark-attendance")}>
                ✅ Mark Attendance
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-label">Total Attendance</div>
              <div className="stat-value">{data.totalAttendance || 0}</div>
              <div className="stat-sub">Days present</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-label">Total Leaves</div>
              <div className="stat-value">{data.totalLeaves || 0}</div>
              <div className="stat-sub">Leaves taken</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Activities</div>
              <div className="stat-value">{data.totalActivities || 0}</div>
              <div className="stat-sub">Reports submitted</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label">Today's Status</div>
              <div className="stat-value" style={{ fontSize: "1.4rem" }}>
                {todayMarked ? "✅" : "⏳"}
              </div>
              <div className="stat-sub">{todayMarked ? "Present" : "Not marked"}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section-card">
            <h3><span>⚡</span> Quick Actions</h3>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="btn btn-auto" onClick={() => navigate("/student/mark-attendance")}>
                ✅ Mark Attendance
              </button>
              <button className="btn btn-auto" style={{ background: "var(--green-600)" }} onClick={() => navigate("/student/apply-leave")}>
                🏖️ Apply Leave
              </button>
              <button className="btn btn-auto" style={{ background: "var(--slate-600)" }} onClick={() => navigate("/student/submit-activity")}>
                📝 Submit Activity
              </button>
            </div>
          </div>

          <div className="two-col">

            {/* Recent Attendance */}
            <div className="section-card">
              <h3><span>📅</span> Recent Attendance</h3>
              {recentAttendance.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>No attendance records yet</p>
                </div>
              ) : (
                <div className="activity-list">
                  {recentAttendance.map((a) => (
                    <div className="activity-item" key={a._id}>
                      <div className={`activity-icon ${a.status === "Present" ? "green" : "amber"}`}>
                        {a.status === "Present" ? "✅" : "🏖️"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{a.status}</div>
                        <div className="activity-meta">
                          {new Date(a.date).toLocaleDateString("en-IN", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="btn-sm btn-outline"
                style={{ marginTop: "1rem" }}
                onClick={() => navigate("/student/my-attendance")}
              >
                View All →
              </button>
            </div>

            {/* Recent Leaves */}
            <div className="section-card">
              <h3><span>📋</span> Recent Leave Requests</h3>
              {recentLeaves.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏖️</div>
                  <p>No leave requests yet</p>
                </div>
              ) : (
                <div className="activity-list">
                  {recentLeaves.map((l) => (
                    <div className="activity-item" key={l._id}>
                      <div className="activity-icon amber">🏖️</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{l.reason?.substring(0, 40)}</div>
                        <div className="activity-meta">
                          {l.fromDate?.substring(0, 10)} → {l.toDate?.substring(0, 10)}
                        </div>
                      </div>
                      <span className={`badge ${l.status === "Approved" ? "badge-approved" : l.status === "Rejected" ? "badge-rejected" : "badge-pending"}`}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="btn-sm btn-outline"
                style={{ marginTop: "1rem" }}
                onClick={() => navigate("/student/my-leaves")}
              >
                View All →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
