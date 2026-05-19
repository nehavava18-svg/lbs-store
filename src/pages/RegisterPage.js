import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student"
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        email: form.email,
        role: form.role
      });

      alert("Registered successfully");

      navigate("/login");

    } catch (err) {
      console.log("REGISTER ERROR:", err.code, err.message);
      alert(err.message);
    }
  };

  return (
    <div style={styles.wrapper}>

      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h1>Join Campus Store</h1>
        <p>
          Create an account as a Student or Staff and access the system.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <form style={styles.card} onSubmit={handleRegister}>
          <h2>Register</h2>

          <input
            placeholder="Email"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>

          <button style={styles.button}>
            Create Account
          </button>
        </form>
      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh"
  },
  left: {
    flex: 1,
    background: "#111",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px"
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "30px",
    width: "320px",
    border: "1px solid #ddd",
    borderRadius: "10px"
  },
  input: {
    padding: "10px"
  },
  button: {
    padding: "10px",
    background: "green",
    color: "white",
    border: "none"
  }
};

export default RegisterPage;