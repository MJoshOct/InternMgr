import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import "./Leave.css";


function Leave() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leave/all");
      setLeaves(res.data.leaves);
    } catch (error) {
      console.log(error);
    }
  };

  const approveLeave = async (id) => {
    await API.put(`/leave/approve/${id}`);
    fetchLeaves();
  };

  const rejectLeave = async (id) => {
    await API.put(`/leave/reject/${id}`);
    fetchLeaves();
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="container-fluid p-4">
        <h2>Leave Requests</h2>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reason</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.internId?.name}</td>
                <td>{leave.reason}</td>
                <td>{leave.fromDate?.substring(0,10)}</td>
                <td>{leave.toDate?.substring(0,10)}</td>
                <td>{leave.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => approveLeave(leave._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => rejectLeave(leave._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Leave;