
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import "./AuthGate.css";

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await reload(currentUser);
          setUser(auth.currentUser);
        } catch {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await sendEmailVerification(result.user);
        setMessage("Verification email bhej di gayi hai. Inbox check karo.");
      } else {
        const result = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await reload(result.user);

        if (!auth.currentUser.emailVerified) {
          await sendEmailVerification(auth.currentUser);
          setMessage("Dashboard kholne se pehle email verify karo. Inbox check karo.");
        }
      }
    } catch (error) {
      const errors = {
        "auth/invalid-email": "Email address sahi nahi hai.",
        "auth/invalid-credential": "Email ya password galat hai.",
        "auth/email-already-in-use": "Is email se account pehle se hai.",
        "auth/weak-password": "Password kam se kam 6 characters ka rakho.",
        "auth/too-many-requests": "Bahut attempts hue. Thodi der baad try karo.",
        "auth/operation-not-allowed": "Firebase mein Email/Password login enable karo.",
        "auth/network-request-failed": "Internet connection check karo.",
      };

      setMessage(errors[error.code] || error.message);
    } finally {
      setBusy(false);
    }
  }

  async function checkVerification() {
    setBusy(true);
    setMessage("");

    try {
      await reload(auth.currentUser);
      setUser(auth.currentUser);

      if (!auth.currentUser.emailVerified) {
        setMessage("Email abhi verify nahi hua. Inbox mein link open karo.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="auth-loading">PayRakshak AI loading...</div>;
  }

  if (user?.emailVerified) {
    return (
      <>
        <button
          className="auth-logout"
          onClick={() => signOut(auth)}
          type="button"
        >
          Logout
        </button>
        {children}
      </>
    );
  }

  if (user && !user.emailVerified) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-shield">🛡️</div>
          <h1>Verify your email</h1>
          <p>
            Verification link <strong>{user.email}</strong> par bheji gayi hai.
            Inbox mein link open karo, phir neeche click karo.
          </p>

          {message && <div className="auth-message">{message}</div>}

          <button
            className="auth-submit"
            onClick={checkVerification}
            disabled={busy}
          >
            {busy ? "Checking..." : "I have verified my email"}
          </button>

          <button
            className="auth-text-button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setMessage("");
              try {
                await sendEmailVerification(auth.currentUser);
                setMessage("Verification email dobara bhej di gayi hai.");
              } catch (error) {
                setMessage(error.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Resend verification email
          </button>

          <button
            className="auth-text-button"
            onClick={() => signOut(auth)}
          >
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-shield">🛡️</div>
        <div className="auth-brand">
          PAYRAKSHAK <span>AI</span>
        </div>

        <h1>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Login to your digital payment security dashboard."
            : "Sign up to protect your digital payments."}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            required
          />

          {message && <div className="auth-message">{message}</div>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy
              ? "Please wait..."
              : mode === "login"
                ? "Login Securely →"
                : "Create Account →"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            className="auth-text-button"
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </div>

        <div className="auth-footer">
          🔒 Secure email authentication
        </div>
      </section>
    </main>
  );
}

