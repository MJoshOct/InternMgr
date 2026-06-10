// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "./Login.css";


// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await API.post("/auth/login", {
//         email,
//         password,
//       });

//       // Save User Data
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", res.data.role);

//       if (res.data.user) {
//         localStorage.setItem(
//           "internId",
//           res.data.user._id
//         );

//         localStorage.setItem(
//           "userName",
//           res.data.user.name
//         );
//       }

//       alert("Login Successful");

//       if (res.data.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/student");
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Invalid Email or Password");
//     }
//   };

//   return (
//     <div className="container mt-5">
      
//       <div className="card p-4 shadow">
        
//         <h2 className="text-center mb-4">
//           Intern Attendance Management System
//         </h2>

//         <div className="mb-3">
//           <input
//             type="email"
//             className="form-control"
//             placeholder="Enter Email"
//             value={email}
//             onChange={(e) =>
//               setEmail(e.target.value)
//             }
//           />
//         </div>

//         <div className="mb-3">
//           <input
//             type="password"
//             className="form-control"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//           />
//         </div>

//         <button
//           className="btn btn-primary w-100"
//           onClick={handleLogin}
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.user) {
        localStorage.setItem("internId", res.data.user._id);
        localStorage.setItem("userName", res.data.user.name);
      }

      alert("Login Successful");

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.log(error);
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="card shadow">
        <div className="header">
          <h1>MECON LIMITED</h1>
          <p className="subtitle">A Govt. of India Enterprise</p>
          <h2>Intern Attendance Management System</h2>
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn w-100" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
