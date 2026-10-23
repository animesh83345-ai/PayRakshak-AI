
import React, { useMemo, useState } from "react";
import "./App.css";

const initialActivity = [
  { title: "Payment safety check", detail: "Demo transaction reviewed", status: "REVIEWED", time: "Just now", icon: "₹" },
  { title: "SMS protection", detail: "Ready to scan a message", status: "READY", time: "Available", icon: "⌕" },
  { title: "Security assistant", detail: "Scam prevention guidance", status: "READY", time: "Available", icon: "✦" }
];

function analyzeText(value) {
  const rules = [
    { pattern: /\b(otp|one.time.password)\b/i, label: "OTP request", points: 25 },
    { pattern: /\b(up(i)? pin|bank pin|password)\b/i, label: "Sensitive credential request", points: 30 },
    { pattern: /\b(urgent|immediately|account blocked|suspended)\b/i, label: "Urgency or account-threat language", points: 15 },
    { pattern: /\b(prize|winner|lottery|free money|reward claimed)\b/i, label: "Prize or reward lure", points: 20 },
    { pattern: /\b(bit\.ly|tinyurl\.com|t\.co|click here|verify kyc)\b/i, label: "Potentially risky link or verification request", points: 25 },
    { pattern: /\b(send money to receive|pay fee to receive|refund fee)\b/i, label: "Suspicious payment instruction", points: 25 }
  ];

  const findings = rules.filter(rule => rule.pattern.test(value));
  const score = Math.min(100, findings.reduce((sum, rule) => sum + rule.points, 0));
  return { score, findings };
}

export default function App() {
  const [page, setPage] = useState("Overview");
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I can help you understand common UPI scams, suspicious SMS messages and payment safety. What would you like to check?" }
  ]);
  const [question, setQuestion] = useState("");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => ({
    checks: history.length,
    flagged: history.filter(item => item.score >= 30).length,
    safe: history.filter(item => item.score < 30).length
  }), [history]);

  function runAnalysis(event) {
    event.preventDefault();
    if (!input.trim()) return;

    const result = analyzeText(input.trim());
    setAnalysis(result);
    setHistory(old => [
      { id: Date.now(), text: input.trim().slice(0, 64), score: result.score, findings: result.findings.length, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ...old
    ].slice(0, 8));
  }

  function sendMessage(event) {
    event.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    let answer = "Verify requests independently through your bank's official app or published support number. Never disclose your UPI PIN, OTP or password.";

    if (/otp|pin|password/i.test(q)) {
      answer = "Never share an OTP, UPI PIN or banking password with anyone. A UPI PIN is used to authorize payments, not to receive money.";
    } else if (/link|url|sms|message/i.test(q)) {
      answer = "Avoid unexpected links, especially those demanding urgent KYC updates, prizes or account verification. Open your bank's official app directly instead.";
    } else if (/fraud|scam|cheat|lost money/i.test(q)) {
      answer = "If you suspect fraud, contact your bank immediately. In India, report suspected cyber financial fraud through the official 1930 helpline and cybercrime.gov.in.";
    }

    setMessages(old => [...old, { role: "user", text: q }, { role: "assistant", text: answer }]);
    setQuestion("");
  }

  const nav = [
    ["Overview", "◈"],
    ["Fraud Analyzer", "⌕"],
    ["SMS & Link Scan", "↗"],
    ["AI Assistant", "✳"],
    ["Scan History", "◷"],
    ["Security Center", "⬡"]
  ];

  const visibleHistory = history.filter(item => item.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>p</span></div>
          <div><b>PayRakshak<span className="brand-ai"> AI</span></b><small>FINANCIAL DEFENSE</small></div>
        </div>

        <div className="nav-caption">MAIN MENU</div>
        <nav>
          {nav.map(([name, icon]) => (
            <button key={name} onClick={() => { setPage(name); setAnalysis(null); }}
              className={`nav-item ${page === name ? "active" : ""}`}>
              <span className="nav-icon">{icon}</span>{name}
              {name === "Fraud Analyzer" && <span className="nav-arrow">↗</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="protection-card">
          <div className="protection-icon">✳</div>
          <b>Protection workspace</b>
          <p>Prototype security tools are ready to use.</p>
          <span><i /> DEMO ENVIRONMENT</span>
        </div>
        <div className="user-profile">
          <div className="avatar">PR</div>
          <div><b>Demo Workspace</b><small>Local session</small></div>
          <span className="profile-dots">•••</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div>
          <div className="top-actions">
            <span className="environment"><i /> PROTOTYPE</span>
            <div className="top-avatar">PR</div>
          </div>
        </header>

        {page === "Overview" && (
          <div className="content">
            <section className="welcome-row">
              <div>
                <div className="eyebrow"><span /> DIGITAL PAYMENT INTELLIGENCE</div>
                <h1>Security <span>Command Center</span></h1>
                <p className="subtitle">Understand risk signals before you trust a payment request.</p>
              </div>
              <button className="button-primary" onClick={() => setPage("Fraud Analyzer")}>＋ New analysis <span>→</span></button>
            </section>

            <section className="hero-banner">
              <div className="hero-copy">
                <span className="hero-label"><span>✳</span> YOUR DIGITAL SAFETY HUB</span>
                <h2>Think before you<br /><span>tap. Pay with confidence.</span></h2>
                <p>Analyze suspicious messages, identify common scam signals and learn safer payment habits.</p>
                <button className="button-light" onClick={() => setPage("Fraud Analyzer")}>Launch fraud analyzer <span>↗</span></button>
              </div>
              <div className="hero-visual">
                <div className="hero-ring ring-a" />
                <div className="hero-ring ring-b" />
                <div className="hero-shield"><span>✓</span></div>
                <div className="floating-chip chip-top">✳ Risk intelligence</div>
                <div className="floating-chip chip-bottom"><i /> Safety tools ready</div>
              </div>
              <div className="hero-glow" />
            </section>

            <div className="section-title">
              <div><h2>Workspace intelligence</h2><p>Metrics from this browser session</p></div>
              <span className="small-tag">LOCAL DEMO DATA</span>
            </div>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-top"><span>ANALYSES RUN</span><span className="stat-icon blue">⌕</span></div>
                <div className="stat-value">{stats.checks.toString().padStart(2, "0")}</div>
                <div className="stat-foot">Checks in this session</div>
                <div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div>
              </div>
              <div className="stat-card">
                <div className="stat-top"><span>FLAGGED FOR REVIEW</span><span className="stat-icon red">⚑</span></div>
                <div className="stat-value">{stats.flagged.toString().padStart(2, "0")}</div>
                <div className="stat-foot">High-signal pattern matches</div>
                <div className="stat-status warning">Requires attention</div>
              </div>
              <div className="stat-card">
                <div className="stat-top"><span>LOW-SIGNAL RESULTS</span><span className="stat-icon green">✓</span></div>
                <div className="stat-value">{stats.safe.toString().padStart(2, "0")}</div>
                <div className="stat-foot">No strong demo rules matched</div>
                <div className="stat-status good">Keep verifying</div>
              </div>
            </section>

            <div className="dashboard-grid">
              <section className="surface">
                <div className="surface-heading"><div><h3>Security toolkit</h3><p>Choose your next action</p></div><span className="heading-symbol">↗</span></div>
                <div className="tool-list">
                  <button className="tool-row" onClick={() => setPage("Fraud Analyzer")}>
                    <span className="tool-symbol purple-bg">₹</span><span className="tool-description"><b>Payment fraud analyzer</b><small>Inspect messages for common risk signals</small></span><span className="tool-chevron">→</span>
                  </button>
                  <button className="tool-row" onClick={() => setPage("SMS & Link Scan")}>
                    <span className="tool-symbol cyan-bg">⌁</span><span className="tool-description"><b>SMS & link intelligence</b><small>Review suspicious URLs and messages</small></span><span className="tool-chevron">→</span>
                  </button>
                  <button className="tool-row" onClick={() => setPage("AI Assistant")}>
                    <span className="tool-symbol gold-bg">✳</span><span className="tool-description"><b>Security assistant</b><small>Explore scam prevention guidance</small></span><span className="tool-chevron">→</span>
                  </button>
                </div>
              </section>

              <section className="surface">
                <div className="surface-heading"><div><h3>Session activity</h3><p>Your recent local checks</p></div><button className="text-button" onClick={() => setPage("Scan History")}>View all ↗</button></div>
                {history.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">◷</div><b>No analyses yet</b><p>Run your first check to see session activity here.</p><button className="button-secondary" onClick={() => setPage("Fraud Analyzer")}>Start first check</button></div>
                ) : history.slice(0, 4).map(item => (
                  <div className="activity-row" key={item.id}><span className={`activity-dot ${item.score >= 30 ? "danger" : "normal"}`} /><div className="activity-copy"><b>{item.text || "Message analysis"}</b><small>{item.time} · {item.findings} signal(s)</small></div><span className={`risk-pill ${item.score >= 30 ? "risk-high" : "risk-low"}`}>{item.score}%</span></div>
                ))}
              </section>
            </div>
            <div className="disclaimer-banner"><span>ⓘ</span><p><b>Prototype notice:</b> This dashboard analyzes text using sample rules. It is not connected to bank accounts, live fraud feeds or a verified AI model.</p></div>
          </div>
        )}

        {(page === "Fraud Analyzer" || page === "SMS & Link Scan") && (
          <div className="content">
            <div className="page-heading"><div className="eyebrow"><span /> THREAT ANALYSIS WORKSPACE</div><h1>{page === "Fraud Analyzer" ? "Fraud Risk Analyzer" : "SMS & Link Intelligence"}</h1><p className="subtitle">Paste the message or URL you want to review. No transaction is performed.</p></div>
            <div className="analyzer-layout">
              <section className="surface analyzer-form">
                <div className="surface-heading"><div><h3>Input intelligence</h3><p>Provide the content for a local rule-based check</p></div><span className="step-badge">01 / INPUT</span></div>
                <form onSubmit={runAnalysis}>
                  <label htmlFor="risk-input">Message, payment request or URL</label>
                  <textarea id="risk-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Example: Your account will be blocked. Verify KYC immediately using this link..." />
                  <div className="input-hint"><span>ⓘ</span> Do not paste real passwords, OTPs or private banking information.</div>
                  <button className="button-primary full-button">Analyze risk signals <span>→</span></button>
                </form>
                <div className="example-box"><b>Try a sample</b><button onClick={() => setInput("URGENT! Your bank account will be blocked. Verify KYC immediately using this link and share OTP.")}>Suspicious KYC message ↗</button><button onClick={() => setInput("Please review the payment amount and recipient in your official banking app.")}>Ordinary payment reminder ↗</button></div>
              </section>

              <section className="surface results-panel">
                <div className="surface-heading"><div><h3>Risk intelligence</h3><p>Rule-based result for this input</p></div><span className="step-badge">02 / RESULTS</span></div>
                {analysis ? (
                  <>
                    <div className="risk-display">
                      <div className={`risk-gauge ${analysis.score >= 50 ? "gauge-high" : analysis.score >= 25 ? "gauge-medium" : "gauge-low"}`}><div><strong>{analysis.score}</strong><small>/ 100</small></div></div>
                      <div><span className={`risk-pill ${analysis.score >= 50 ? "risk-high" : analysis.score >= 25 ? "risk-medium" : "risk-low"}`}>{analysis.score >= 50 ? "HIGH SIGNAL" : analysis.score >= 25 ? "REVIEW NEEDED" : "LOW SIGNAL"}</span><h3>{analysis.score >= 50 ? "Potential warning signs" : analysis.score >= 25 ? "Review carefully" : "Few rules triggered"}</h3><p>This score reflects matched demo rules, not the true probability of fraud.</p></div>
                    </div>
                    <div className="findings-title">DETECTED INDICATORS <span>{analysis.findings.length}</span></div>
                    {analysis.findings.length ? analysis.findings.map(item => <div className="finding" key={item.label}><span>⚑</span><div><b>{item.label}</b><small>Matched a local detection rule</small></div></div>) : <div className="no-findings">✓ No configured warning pattern matched. This does not mean the content is safe.</div>}
                    <div className="next-step"><b>Recommended next step</b><p>Verify the sender independently, avoid unknown links, and never share your UPI PIN or OTP.</p></div>
                  </>
                ) : <div className="empty-state large-empty"><div className="empty-icon">⌕</div><b>Awaiting input analysis</b><p>Submit content to view its rule matches, score and safety guidance.</p></div>}
              </section>
            </div>
            <div className="disclaimer-banner"><span>ⓘ</span><p>This is an educational prototype. A message may be fraudulent even when no configured rule matches.</p></div>
          </div>
        )}

        {page === "AI Assistant" && (
          <div className="content">
            <div className="page-heading"><div className="eyebrow"><span /> SECURITY KNOWLEDGE</div><h1>AI Security Assistant</h1><p className="subtitle">Ask about UPI safety, suspicious messages and common scams.</p></div>
            <section className="surface chat-surface">
              <div className="chat-header"><div className="assistant-avatar">✳</div><div><b>Rakshak Assistant</b><small><i /> Local demo assistant · Predefined guidance</small></div><span className="step-badge">DEMO</span></div>
              <div className="chat-body">{messages.map((item, index) => <div className={`chat-message ${item.role}`} key={index}><span className="chat-avatar">{item.role === "user" ? "YOU" : "✳"}</span><div><small>{item.role === "user" ? "YOU" : "RAKSHAK ASSISTANT"}</small><p>{item.text}</p></div></div>)}</div>
              <div className="quick-questions">{["How do I protect my UPI PIN?", "How can I spot a fake link?", "What if I lost money to fraud?"].map(q => <button key={q} onClick={() => setQuestion(q)}>{q} ↗</button>)}</div>
              <form className="chat-compose" onSubmit={sendMessage}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a security question..." /><button className="button-primary">Send ↑</button></form>
              <p className="disclaimer">This assistant uses predefined local responses. It is not a live generative AI service.</p>
            </section>
          </div>
        )}

        {page === "Scan History" && (
          <div className="content">
            <div className="page-heading"><div className="eyebrow"><span /> LOCAL SESSION RECORDS</div><h1>Scan History</h1><p className="subtitle">Analyses stored temporarily in this page session.</p></div>
            <section className="surface">
              <div className="surface-heading"><div><h3>Recent analyses</h3><p>{history.length} recorded in this session</p></div><input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." /></div>
              {visibleHistory.length === 0 ? <div className="empty-state"><div className="empty-icon">◷</div><b>No matching records</b><p>Run an analysis to populate this table.</p><button className="button-secondary" onClick={() => setPage("Fraud Analyzer")}>New analysis</button></div> : <div className="history-table"><div className="table-header"><span>INPUT SUMMARY</span><span>TIME</span><span>RISK SCORE</span></div>{visibleHistory.map(item => <div className="table-row" key={item.id}><span>{item.text}</span><span>{item.time}</span><span className={`risk-pill ${item.score >= 30 ? "risk-high" : "risk-low"}`}>{item.score}/100</span></div>)}</div>}
            </section>
          </div>
        )}

        {page === "Security Center" && (
          <div className="content">
            <div className="page-heading"><div className="eyebrow"><span /> PERSONAL SECURITY</div><h1>Security Center</h1><p className="subtitle">Practical guidance for safer digital payments in India.</p></div>
            <div className="security-grid">
              {[
                ["01", "Protect your UPI PIN", "A PIN authorizes payments. Never disclose it to callers or enter it to receive money."],
                ["02", "Verify payment requests", "Check the payee name and amount inside your official payment app before approving."],
                ["03", "Avoid unknown links", "Do not use unexpected KYC, refund or prize links. Open the official app directly."],
                ["04", "Never share an OTP", "Banks and legitimate support staff should not ask you to reveal your OTP or password."],
                ["05", "Act quickly after fraud", "Contact your bank immediately. In India, report suspected financial cyber fraud at 1930 or cybercrime.gov.in."],
                ["06", "Check before installing", "Avoid remote-access apps suggested by strangers claiming to help with a refund."]
              ].map(([number, title, body]) => <div className="tip-card" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>)}
            </div>
          </div>
        )}

        <footer className="footer"><span className="footer-mark">P</span> PayRakshak AI <span className="footer-divider">/</span> Digital payment safety prototype <span className="footer-right">BUILT FOR SECURITY AWARENESS</span></footer>
      </main>
    </div>
  );
}

