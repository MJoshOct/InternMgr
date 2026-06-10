import { useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";

function AddIntern() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  const addIntern = async () => {
    try {
      await API.post("/auth/register-intern", {
        name,
        email,
        password,
        department,
      });

      alert("Intern Added Successfully");

      setName("");
      setEmail("");
      setDepartment("");
      setPassword("");
    } catch (error) {
      console.log(error);
      alert("Error Adding Intern");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="container p-4">
        <h2>Add New Intern</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Intern Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-success"
          onClick={addIntern}
        >
          Add Intern
        </button>
      </div>
    </div>
  );
}

export default AddIntern;