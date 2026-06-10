import { useState } from "react";
import API from "../services/api";
import StudentSidebar from "../components/StudentSidebar";
import { useToast } from "../components/Toast";

function SubmitActivity() {
  const [tasks, setTasks] = useState("");
  const [blockers, setBlockers] = useState("");
  const [plan, setPlan] = useState("");
  const [hours, setHours] = useState("8 hours");
  const showToast = useToast();

  const submitActivity = async () => {
    if (!tasks) {
      showToast("Please describe your tasks", "error");
      return;
    }
    try {
      const internId = localStorage.getItem("internId");
      const activity = `Tasks: ${tasks}${blockers ? ` | Blockers: ${blockers}` : ""}${plan ? ` | Plan: ${plan}` : ""} | Hours: ${hours}`;
      await API.post("/activity/submit", { internId, activity });
      showToast("Daily report submitted!", "success");
      setTasks(""); setBlockers(""); setPlan("");
    } catch (error) {
      console.log(error);
      showToast("Error submitting activity", "error");
    }
  };

  const todayStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="app-shell">
      <StudentSidebar />
      <div className="main-content">
        <div className="topbar">
          <h2>Submit Activity</h2>
          <div className="topbar-right">
            <span className="text-muted" style={{ fontSize: "0.82rem" }}>{today}</span>
            <span className="badge-notif">Intern</span>
          </div>
        </div>
        <div className="page-content">
          <div className="page-header">
            <div><h2>Daily Activities</h2><p>Submit your end-of-day report</p></div>
          </div>
          <div className="section-card" style={{ maxWidth: 680 }}>
            <h3><span>📝</span> Submit Today's Report</h3>
            <div className="form-group">
              <label>Date</label>
              <input type="text" value={todayStr} readOnly style={{ background: "var(--slate-50)" }} />
            </div>
            <div className="form-group">
              <label>Tasks Completed *</label>
              <textarea
                placeholder={"• Completed feature X\n• Fixed bug in module Y\n• Attended standup meeting"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                style={{ minHeight: 100 }}
              />
            </div>
            <div className="form-group">
              <label>Challenges / Blockers</label>
              <textarea placeholder="Any blockers or challenges faced today..." value={blockers} onChange={(e) => setBlockers(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Plan for Tomorrow</label>
              <textarea placeholder="What you plan to work on tomorrow..." value={plan} onChange={(e) => setPlan(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hours Worked</label>
              <select value={hours} onChange={(e) => setHours(e.target.value)}>
                <option>4 hours</option>
                <option>5 hours</option>
                <option>6 hours</option>
                <option>7 hours</option>
                <option>8 hours</option>
                <option>9 hours</option>
              </select>
            </div>
            <button className="btn btn-auto" onClick={submitActivity}>Submit Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitActivity;
