import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";

import MarkAttendance from "./pages/MarkAttendance";
import ApplyLeave from "./pages/ApplyLeave";
import SubmitActivity from "./pages/SubmitActivity";

import MyLeaves from "./pages/MyLeaves";
import MyAttendance from "./pages/MyAttendance";
import MyActivities from "./pages/MyActivities";
import ManageInterns from "./pages/ManageInterns";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/reports" element={<Reports />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/submit-activity" element={<SubmitActivity />} />

        {/* Student History Pages */}
        <Route path="/my-leaves" element={<MyLeaves />} />
        <Route path="/my-attendance" element={<MyAttendance />} />
        <Route path="/my-activities" element={<MyActivities />} />
        <Route path="/interns" element={<ManageInterns />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;