import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Activity,
  BarChart2,
  Users,
  LogOut,
} from "lucide-react";
import "./AdminSidebar.css";

const navItems = [
  { to: "/admin",      label: "Dashboard",     icon: LayoutDashboard },
  { to: "/interns",    label: "Interns",        icon: Users },
  { to: "/attendance", label: "Attendance",     icon: CalendarCheck },
  { to: "/leave",      label: "Leave Requests", icon: FileText },
  { to: "/activities", label: "Activities",     icon: Activity },
  { to: "/reports",    label: "Reports",        icon: BarChart2 },
];

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("internId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <aside className="sidebar">

      {/* ── Brand ── */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">A</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">Admin Panel</span>
          <span className="sidebar-brand-sub">Intern Management</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* ── Nav ── */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Menu</span>

        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar-nav-item${active ? " active" : ""}`}
            >
              <Icon size={16} className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{label}</span>
              {active && <span className="sidebar-nav-dot" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">A</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin</span>
            <span className="sidebar-user-role">Administrator</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>

    </aside>
  );
}

export default AdminSidebar;
