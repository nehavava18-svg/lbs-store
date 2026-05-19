import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoggingIn(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const snap = await getDoc(doc(db, "users", cred.user.uid));
      const role = snap.exists() ? snap.data().role : null;

      if (!role) {
        setError("Account has no role assigned. Contact admin.");
        setLoggingIn(false);
        return;
      }

      // ✅ Navigate based on role — no catch-all redirect to /register
      if (role === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/store");
      }

    } catch (err) {
      // ✅ Show a real error message instead of bouncing to /register
      console.error(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
      setLoggingIn(false);
    }
  };

  return (
    <div style={styles.wrapper}>

      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h1>Campus Store</h1>
        <p>Login to access your student or staff dashboard.</p>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <form style={styles.card} onSubmit={handleLogin}>
          <h2>Login</h2>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.button} disabled={loggingIn}>
            {loggingIn ? "Logging in..." : "Login"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem" }}>
            No account?{" "}
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
  },
  left: {
    flex: 1,
    background: "#111",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "30px",
    width: "320px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  input: {
    padding: "10px",
  },
  button: {
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "0.875rem",
  },
};

export default LoginPage;