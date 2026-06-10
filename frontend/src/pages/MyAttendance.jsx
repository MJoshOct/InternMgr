import { useEffect, useState } from "react";
import API from "../services/api";
import StudentSidebar from "../components/StudentSidebar";

function MyAttendance() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    try {
      const internId = localStorage.getItem("internId");
      const res = await API.get(`/attendance/history/${internId}`);
      setAttendance(res.data.attendance || []);
    } catch (error) {
      console.log(error);
    }
  };

  const statusBadge = (status) => {
    const cls = status?.toLowerCase() === "present" ? "badge-present"
      : status?.toLowerCase() === "absent" ? "badge-absent" : "badge-leave";
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const attendanceMap = {};
  attendance.forEach((a) => {
    const d = new Date(a.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      attendanceMap[d.getDate()] = a.status?.toLowerCase();
    }
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="app-shell">
      <StudentSidebar />
      <div className="main-content">
        <div className="topbar">
          <h2>Attendance History</h2>
          <div className="topbar-right">
            <span className="text-muted" style={{ fontSize: "0.82rem" }}>{today}</span>
            <span className="badge-notif">Intern</span>
          </div>
        </div>
        <div className="page-content">
          <div className="page-header">
            <div><h2>Attendance History</h2><p>Your full attendance record</p></div>
          </div>

          <div className="section-card" style={{ marginBottom: "1.5rem" }}>
            <h3><span>📅</span> {monthName} Calendar</h3>
            <div className="calendar">
              <div className="cal-grid">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div className="cal-day-name" key={d}>{d}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div className="cal-day empty" key={`e${i}`}></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const status = attendanceMap[day] || "";
                  const isToday = day === now.getDate();
                  return (
                    <div className={`cal-day ${status} ${isToday ? "today" : ""}`} key={day}>{day}</div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="section-card">
            <h3><span>📋</span> Attendance Log</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--muted)" }}>No records yet</td></tr>
                  ) : (
                    attendance.map((item) => {
                      const d = new Date(item.date);
                      return (
                        <tr key={item._id}>
                          <td style={{ fontWeight: 600 }}>
                            {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td style={{ color: "var(--muted)" }}>
                            {d.toLocaleDateString("en-IN", { weekday: "long" })}
                          </td>
                          <td>{statusBadge(item.status)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAttendance;
