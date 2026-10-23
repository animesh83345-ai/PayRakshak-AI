
import { useState } from "react";
import "./AuthGate.css";

export default function AuthGate({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Email aur password dono enter karo.");
      return;
    }

    // Demo login only: no Firebase or real authentication.
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setMessage("");
  }

  if (loggedIn) {
    return (
      <>
        <button
          type="button"
          className="auth-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
        {children}
      </>
    );
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-shield">🛡️</div>

        <div className="auth-brand">
          PAY<span>RAKSHAK</span> AI
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Enter your email and password to continue.
        </p>

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter any email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter any password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && (
          <p className="auth-message" role="alert">
            {message}
          </p>
        )}

        <button className="auth-submit" type="submit">
          Login
        </button>

        <div className="auth-footer">
          PayRakshak AI · Demo Login
        </div>
      </form>
    </main>
  );
}
