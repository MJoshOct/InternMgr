import { NavLink, useNavigate } from "react-router-dom";

function StudentSidebar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Intern";
  const parts = userName.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : userName.substring(0, 2).toUpperCase();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    padding: "0.55rem 0.75rem",
    borderRadius: "8px",
    marginBottom: "2px",
    fontSize: "0.85rem",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.15s",
    background: isActive ? "#2563EB" : "transparent",
    color: isActive ? "#fff" : "#334155",
  });

  const sectionLabel = {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#94A3B8",
    padding: "0 0.5rem",
    margin: "1rem 0 0.4rem",
    display: "block",
  };

  return (
    <aside style={{
      width: "240px",
      background: "#F8FAFC",
      borderRight: "1px solid #E2E8F0",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 50,
    }}>

      <div style={{ padding: "1.5rem 1.25rem 1.25rem", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{
          width: 36, height: 36, background: "#2563EB", borderRadius: 9,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem",
        }}>I</div>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A" }}>IAMS</div>
        <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: 1 }}>Intern Portal</div>
      </div>

      <div style={{
        padding: "1rem 1.25rem",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "#2563EB",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.8rem", fontWeight: 700, color: "#fff", flexShrink: 0,
        }}>{initials}</div>
        <div>
          <div style={{ fontSize: "0.83rem", fontWeight: 600, color: "#0F172A" }}>{userName}</div>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Intern</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
        <span style={sectionLabel}>Main</span>
        <NavLink to="/student" end style={({ isActive }) => navStyle(isActive)}>Dashboard</NavLink>

        <span style={sectionLabel}>Attendance</span>
        <NavLink to="/student/mark-attendance" style={({ isActive }) => navStyle(isActive)}>Mark Attendance</NavLink>
        <NavLink to="/student/my-attendance" style={({ isActive }) => navStyle(isActive)}>Attendance History</NavLink>

        <span style={sectionLabel}>Leave</span>
        <NavLink to="/student/apply-leave" style={({ isActive }) => navStyle(isActive)}>Apply Leave</NavLink>
        <NavLink to="/student/my-leaves" style={({ isActive }) => navStyle(isActive)}>Leave Status</NavLink>

        <span style={sectionLabel}>Daily</span>
        <NavLink to="/student/submit-activity" style={({ isActive }) => navStyle(isActive)}>Submit Activity</NavLink>
        <NavLink to="/student/my-activities" style={({ isActive }) => navStyle(isActive)}>My Activities</NavLink>
      </nav>

      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #E2E8F0" }}>
        <button
          onClick={logout}
          style={{
            width: "100%", padding: "0.5rem 0.75rem",
            background: "transparent", border: "1.5px solid #E2E8F0",
            color: "#64748B", fontFamily: "inherit", fontSize: "0.83rem",
            cursor: "pointer", borderRadius: 7, transition: "all 0.15s",
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "#FEE2E2";
            e.currentTarget.style.color = "#DC2626";
            e.currentTarget.style.borderColor = "#FCA5A5";
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748B";
            e.currentTarget.style.borderColor = "#E2E8F0";
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default StudentSidebar;
