import { useState } from "react";
import API from "../services/api";
import StudentSidebar from "../components/StudentSidebar";
import { useToast } from "../components/Toast";

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [contact, setContact] = useState("");
  const showToast = useToast();

  const applyLeave = async () => {
    if (!fromDate || !toDate || !reason) {
      showToast("Please fill all required fields", "error");
      return;
    }
    try {
      const internId = localStorage.getItem("internId");
      await API.post("/leave/apply", { internId, reason: `${leaveType}: ${reason}`, fromDate, toDate });
      showToast("Leave request submitted!", "success");
      setReason(""); setFromDate(""); setToDate(""); setContact("");
    } catch (error) {
      console.log(error);
      showToast("Error applying leave", "error");
    }
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="app-shell">
      <StudentSidebar />
      <div className="main-content">
        <div className="topbar">
          <h2>Apply Leave</h2>
          <div className="topbar-right">
            <span className="text-muted" style={{ fontSize: "0.82rem" }}>{today}</span>
            <span className="badge-notif">Intern</span>
          </div>
        </div>
        <div className="page-content">
          <div className="page-header">
            <div><h2>Apply for Leave</h2><p>Submit a leave request</p></div>
          </div>
          <div className="two-col">
            <div className="section-card">
              <h3><span>📝</span> Leave Application</h3>
              <div className="form-group">
                <label>Leave Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Personal Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>From Date</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Reason *</label>
                <textarea placeholder="Describe the reason for your leave..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Alternate Contact (optional)</label>
                <input type="text" placeholder="Phone or email during leave" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <button className="btn" onClick={applyLeave}>Submit Leave Request</button>
            </div>
            <div className="section-card">
              <h3><span>📊</span> Leave Balance</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span>Sick Leave</span><span style={{ fontWeight: 700 }}>6 total</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: "50%", background: "var(--red-600)" }}></div></div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span>Casual Leave</span><span style={{ fontWeight: 700 }}>4 total</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: "25%", background: "var(--amber-600)" }}></div></div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span>Personal Leave</span><span style={{ fontWeight: 700 }}>3 total</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: "0%" }}></div></div>
                </div>
              </div>
              <hr className="divider" />
              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                Apply in advance for planned absences. Emergency leaves may require documentation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeave;
