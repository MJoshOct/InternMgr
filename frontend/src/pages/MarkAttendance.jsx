import API from "../services/api";

function MarkAttendance() {
  const markAttendance = async () => {
    try {
      const internId = localStorage.getItem("internId");

      await API.post("/attendance/mark", {
        internId,
      });

      alert("Attendance Marked Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Mark Attendance</h2>

      <button
        className="btn btn-success"
        onClick={markAttendance}
      >
        Mark Present
      </button>
    </div>
  );
}

export default MarkAttendance;