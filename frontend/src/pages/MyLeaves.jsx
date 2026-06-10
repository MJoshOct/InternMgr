import { useEffect, useState } from "react";
import API from "../services/api";
import StudentSidebar from "../components/StudentSidebar";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      const internId = localStorage.getItem("internId");
      const res = await API.get(`/leave/my/${internId}`);
      setLeaves(res.data.leaves || []);
    } catch (error) {
      console.log(error);
    }
  };

  const statusBadge = (status) => {
    const cls = status === "Approved" ? "badge-approved" : status === "Rejected" ? "badge-rejected" : "badge-pending";
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="app-shell">
      <StudentSidebar />
      <div className="main-content">
        <div className="topbar">
          <h2>Leave Status</h2>
          <div className="topbar-right">
            <span className="text-muted" style={{ fontSize: "0.82rem" }}>{today}</span>
            <span className="badge-notif">Intern</span>
          </div>
        </div>
        <div className="page-content">
          <div className="page-header">
            <div><h2>Leave Status</h2><p>Track your leave applications</p></div>
          </div>
          <div className="section-card">
            <h3><span>📋</span> My Leave Applications</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Reason</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>No leave applications found</td></tr>
                  ) : (
                    leaves.map((leave) => (
                      <tr key={leave._id}>
                        <td>{leave.reason}</td>
                        <td>{leave.fromDate?.substring(0, 10)}</td>
                        <td>{leave.toDate?.substring(0, 10)}</td>
                        <td>{statusBadge(leave.status)}</td>
                      </tr>
                    ))
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

export default MyLeaves;
