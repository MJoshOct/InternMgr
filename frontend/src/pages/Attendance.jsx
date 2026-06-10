import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";

// Indian Central Govt. Gazetted Holidays (Compulsory + Restricted)
const HOLIDAYS = {
  // ── 2025 ──────────────────────────────────────────────
  "2025-01-14": "Makar Sankranti / Pongal",
  "2025-01-26": "Republic Day",
  "2025-02-02": "Basant Panchami (Saraswati Puja)",
  "2025-02-19": "Chhatrapati Shivaji Maharaj Jayanti",
  "2025-02-26": "Guru Ravidas Jayanti",
  "2025-03-13": "Mahashivratri",
  "2025-03-14": "Holika Dahan",
  "2025-03-15": "Holi",
  "2025-03-30": "Ram Navami",
  "2025-03-31": "Id-ul-Fitr (Eid)",
  "2025-04-06": "Mahavir Jayanti",
  "2025-04-10": "Shri Ram Navami",
  "2025-04-14": "Dr. B.R. Ambedkar Jayanti",
  "2025-04-18": "Good Friday",
  "2025-05-01": "Maharashtra Day / Labour Day",
  "2025-05-12": "Buddha Purnima",
  "2025-06-07": "Id-ul-Zuha (Bakrid)",
  "2025-06-27": "Rath Yatra",
  "2025-07-06": "Muharram",
  "2025-08-09": "Raksha Bandhan",
  "2025-08-15": "Independence Day",
  "2025-08-16": "Janmashtami",
  "2025-09-05": "Milad-un-Nabi (Eid-e-Milad)",
  "2025-09-29": "Dussehra (Maha Navami)",
  "2025-10-02": "Gandhi Jayanti / Dussehra",
  "2025-10-20": "Diwali (Lakshmi Puja)",
  "2025-10-21": "Diwali (Naraka Chaturdashi)",
  "2025-10-23": "Govardhan Puja",
  "2025-10-24": "Bhai Dooj",
  "2025-11-05": "Guru Nanak Jayanti",
  "2025-11-24": "Guru Tegh Bahadur Martyrdom Day",
  "2025-12-25": "Christmas Day",

  // ── 2026 ──────────────────────────────────────────────
  "2026-01-01": "New Year's Day",
  "2026-01-14": "Makar Sankranti / Pongal",
  "2026-01-26": "Republic Day",
  "2026-02-15": "Basant Panchami (Saraswati Puja)",
  "2026-03-03": "Mahashivratri",
  "2026-03-19": "Holi",
  "2026-03-20": "Id-ul-Fitr (Eid)",
  "2026-04-02": "Ram Navami",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Dr. B.R. Ambedkar Jayanti",
  "2026-04-25": "Mahavir Jayanti",
  "2026-05-01": "Labour Day",
  "2026-05-31": "Buddha Purnima",
  "2026-06-27": "Id-ul-Zuha (Bakrid)",
  "2026-07-16": "Muharram",
  "2026-08-15": "Independence Day",
  "2026-08-25": "Janmashtami",
  "2026-09-24": "Milad-un-Nabi (Eid-e-Milad)",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-19": "Dussehra",
  "2026-11-08": "Diwali (Lakshmi Puja)",
  "2026-11-09": "Diwali (Naraka Chaturdashi)",
  "2026-11-25": "Guru Nanak Jayanti",
  "2026-12-25": "Christmas Day",
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function toKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

// internAttendance: { "YYYY-MM-DD": "Present" | "Absent" | "Leave" }
function HolidayCalendar({ internAttendance = {} }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const { year, month } = current;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrent(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
  };

  const nextMonth = () => {
    setCurrent(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );
  };

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  // Holidays in this month — untouched
  const monthHolidays = Object.entries(HOLIDAYS).filter(([key]) => {
    const [y, m] = key.split("-").map(Number);
    return y === year && m === month + 1;
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Attendance status → border color (holiday bg stays untouched underneath)
  const statusBorder = {
    Present: "#16A34A",
    Absent:  "#94A3B8",
    Leave:   "#D97706",
  };
  const statusBg = {
    Present: "rgba(22,163,74,0.12)",
    Absent:  "rgba(148,163,184,0.15)",
    Leave:   "rgba(217,119,6,0.12)",
  };

  return (
    <div style={styles.calendarCard}>
      {/* Header */}
      <div style={styles.calHeader}>
        <button style={styles.navBtn} onClick={prevMonth}>‹</button>
        <span style={styles.calTitle}>{monthName} {year}</span>
        <button style={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      {/* Day labels */}
      <div style={styles.grid}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
          <div key={d} style={styles.dayLabel}>{d}</div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const key = toKey(year, month, day);
          const isHoliday = !!HOLIDAYS[key];
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const status = internAttendance[key]; // "Present" | "Absent" | "Leave" | undefined

          const cellStyle = {
            ...styles.dayCell,
            // holiday bg first (untouched)
            ...(isHoliday ? styles.holiday : {}),
            // today overrides holiday bg
            ...(isToday ? styles.today : {}),
            // attendance: coloured border + subtle tint on top
            ...(status && !isToday ? {
              background: isHoliday ? styles.holiday.background : statusBg[status],
              border: `2px solid ${statusBorder[status]}`,
              borderRadius: "8px",
            } : {}),
          };

          const tooltip = [
            isHoliday ? HOLIDAYS[key] : "",
            status ? status : "",
          ].filter(Boolean).join(" · ");

          return (
            <div key={key} title={tooltip} style={cellStyle}>
              {day}
              {/* Holiday dot — untouched */}
              {isHoliday && <span style={styles.dot} />}
              {/* Attendance indicator dot */}
              {status && !isToday && (
                <span style={{
                  ...styles.dot,
                  background: statusBorder[status],
                  // if both holiday dot and status dot exist, push it slightly right
                  ...(isHoliday ? { marginLeft: "3px" } : {}),
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Attendance legend — only shown when an intern is selected */}
      {Object.keys(internAttendance).length > 0 && (
        <div style={{ ...styles.legend, borderBottom: "1px solid #E2E8F0", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
          <p style={styles.legendTitle}>Attendance</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: "Present", color: "#16A34A", bg: "rgba(22,163,74,0.12)" },
              { label: "Absent",  color: "#94A3B8", bg: "rgba(148,163,184,0.15)" },
              { label: "Leave",   color: "#D97706", bg: "rgba(217,119,6,0.12)" },
            ].map(({ label, color, bg }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{
                  width: "14px", height: "14px", borderRadius: "4px",
                  background: bg, border: `2px solid ${color}`,
                }} />
                <span style={{ fontSize: "0.72rem", color: "#334155" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holiday legend — untouched */}
      <div style={styles.legend}>
        <p style={styles.legendTitle}>
          {monthHolidays.length > 0 ? "Holidays this month" : "No holidays this month"}
        </p>
        {monthHolidays.map(([key, name]) => (
          <div key={key} style={styles.legendItem}>
            <span style={styles.legendDot} />
            <span style={styles.legendDate}>
              {new Date(key + "T00:00:00").toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span style={styles.legendName}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [selectedInternId, setSelectedInternId] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/all");
      setAttendance(res.data.attendance);
    } catch (error) {
      console.log(error);
    }
  };

  // Unique interns from attendance data
  const interns = Array.from(
    new Map(
      attendance
        .filter((a) => a.internId?._id)
        .map((a) => [a.internId._id, a.internId])
    ).values()
  );

  // Build { "YYYY-MM-DD": "Present"|"Absent"|"Leave" } for selected intern
  const internAttendance = attendance
    .filter((a) => a.internId?._id === selectedInternId)
    .reduce((acc, a) => {
      const key = new Date(a.date).toISOString().split("T")[0];
      acc[key] = a.status; // expects "Present", "Absent", or "Leave"
      return acc;
    }, {});

  // Rows shown in table — all if no intern selected, filtered if one is
  const tableRows = selectedInternId
    ? attendance.filter((a) => a.internId?._id === selectedInternId)
    : attendance;

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="container-fluid p-4" style={{ flex: 1 }}>
        <div style={styles.pageHeader}>
          <h2 style={{ margin: 0 }}>Attendance Records</h2>
          {selectedInternId && (
            <div style={styles.selectedBadge}>
              <span>
                {interns.find(i => i._id === selectedInternId)?.name}
              </span>
              <button
                style={styles.clearBtn}
                onClick={() => setSelectedInternId("")}
                title="Clear selection"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {!selectedInternId && (
          <p style={styles.hint}>Click any row to view that intern's attendance on the calendar</p>
        )}

        <div style={styles.contentRow}>
          {/* Table */}
          <div style={styles.tableWrap}>
            <table className="table table-bordered table-striped mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Intern Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.length > 0 ? (
                  tableRows.map((item, index) => {
                    const isSelected = item.internId?._id === selectedInternId;
                    return (
                      <tr
                        key={item._id}
                        onClick={() =>
                          setSelectedInternId(
                            isSelected ? "" : item.internId?._id
                          )
                        }
                        style={{
                          cursor: "pointer",
                          background: isSelected ? "#EFF6FF" : undefined,
                          outline: isSelected ? "2px solid #2563EB" : undefined,
                          outlineOffset: "-2px",
                        }}
                      >
                        <td>{index + 1}</td>
                        <td style={{ fontWeight: isSelected ? 600 : 400 }}>
                          {item.internId?.name}
                        </td>
                        <td>{item.internId?.email}</td>
                        <td>
                          <span style={{
                            ...styles.badge,
                            ...(item.status === "Present" ? styles.badgePresent
                              : item.status === "Leave" ? styles.badgeLeave
                              : styles.badgeAbsent),
                          }}>
                            {item.status}
                          </span>
                        </td>
                        <td>{new Date(item.date).toLocaleDateString("en-IN")}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#94A3B8", padding: "2rem" }}>
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Calendar */}
          <div style={styles.calendarWrap}>
            {selectedInternId && (
              <p style={styles.calendarInternLabel}>
                📅 <strong>{interns.find(i => i._id === selectedInternId)?.name}</strong>
              </p>
            )}
            <HolidayCalendar internAttendance={internAttendance} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.25rem",
    flexWrap: "wrap",
  },
  selectedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#EFF6FF",
    border: "1.5px solid #2563EB",
    borderRadius: "100px",
    padding: "3px 10px 3px 14px",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#1D4ED8",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#60A5FA",
    fontSize: "0.85rem",
    lineHeight: 1,
    padding: "0 2px",
  },
  hint: {
    fontSize: "0.78rem",
    color: "#94A3B8",
    margin: "0 0 0.25rem",
  },
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "100px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  badgePresent: {
    background: "rgba(22,163,74,0.12)",
    color: "#15803D",
    border: "1px solid rgba(22,163,74,0.3)",
  },
  badgeAbsent: {
    background: "rgba(148,163,184,0.15)",
    color: "#475569",
    border: "1px solid rgba(148,163,184,0.4)",
  },
  badgeLeave: {
    background: "rgba(217,119,6,0.12)",
    color: "#B45309",
    border: "1px solid rgba(217,119,6,0.3)",
  },
  calendarInternLabel: {
    fontSize: "0.78rem",
    color: "#64748B",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  contentRow: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  tableWrap: {
    flex: 1,
    minWidth: 0,
  },
  calendarWrap: {
    width: "280px",
    flexShrink: 0,
    marginTop: "1rem",
  },
  calendarCard: {
    background: "#ffffff",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  calHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  calTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#1E293B",
  },
  navBtn: {
    background: "none",
    border: "none",
    fontSize: "1.1rem",
    color: "#64748B",
    cursor: "pointer",
    padding: "2px 8px",
    borderRadius: "6px",
    lineHeight: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "2px",
    marginBottom: "0.75rem",
  },
  dayLabel: {
    textAlign: "center",
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#94A3B8",
    textTransform: "uppercase",
    padding: "4px 0",
  },
  dayCell: {
    textAlign: "center",
    fontSize: "0.75rem",
    padding: "5px 2px",
    borderRadius: "6px",
    color: "#334155",
    cursor: "default",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  today: {
    background: "#2563EB",
    color: "#ffffff",
    fontWeight: 700,
    borderRadius: "8px",
  },
  holiday: {
    background: "#FEF3C7",
    color: "#92400E",
    fontWeight: 600,
    borderRadius: "8px",
  },
  dot: {
    display: "block",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#D97706",
  },
  legend: {
    borderTop: "1px solid #E2E8F0",
    paddingTop: "0.75rem",
  },
  legendTitle: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 0.5rem",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  },
  legendDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#D97706",
    flexShrink: 0,
  },
  legendDate: {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#64748B",
    minWidth: "44px",
  },
  legendName: {
    fontSize: "0.72rem",
    color: "#334155",
  },
};

export default Attendance;
