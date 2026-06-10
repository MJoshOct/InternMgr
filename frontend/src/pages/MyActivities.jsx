import { useEffect, useState } from "react";
import API from "../services/api";
import StudentSidebar from "../components/StudentSidebar";

function MyActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const internId = localStorage.getItem("internId");
      const res = await API.get(`/activity/my/${internId}`);
      setActivities(res.data.activities || []);
    } catch (error) {
      console.log(error);
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
          <h2>My Activities</h2>
          <div className="topbar-right">
            <span className="text-muted" style={{ fontSize: "0.82rem" }}>{today}</span>
            <span className="badge-notif">Intern</span>
          </div>
        </div>
        <div className="page-content">
          <div className="page-header">
            <div><h2>My Activities</h2><p>Your submitted daily reports</p></div>
          </div>
          <div className="section-card">
            <h3><span>🕐</span> Activity Log</h3>
            {activities.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>No activities submitted yet</p>
              </div>
            ) : (
              <div className="activity-list">
                {activities.map((activity) => {
                  const d = new Date(activity.createdAt);
                  const dateStr = d.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
                  const preview = activity.activity?.length > 80
                    ? activity.activity.substring(0, 80) + "…"
                    : activity.activity;
                  return (
                    <div className="activity-item" key={activity._id}>
                      <div className="activity-icon blue">📝</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{dateStr}</div>
                        <div className="activity-meta">{preview}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyActivities;
