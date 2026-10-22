
import { useState } from "react";
import {
  ShieldCheck, LayoutDashboard, ScanSearch, Image as ImageIcon,
  MessageCircle, Link2, History, Mic, Bell, ArrowRight, ArrowUpRight,
  CheckCircle2, AlertTriangle, LockKeyhole, Activity, Upload, Send,
  Sparkles, Menu, X, Search
} from "lucide-react";
import "./styles.css";

const tools = [
  { id: "fraud", name: "Fraud Detector", desc: "Check payment details for warning signs.", icon: ShieldCheck, color: "green" },
  { id: "screenshot", name: "Screenshot Checker", desc: "Select a payment screenshot for review.", icon: ImageIcon, color: "blue" },
  { id: "chat", name: "AI Safety Chat", desc: "Get practical scam prevention guidance.", icon: MessageCircle, color: "purple" },
  { id: "scanner", name: "SMS & Link Scanner", desc: "Inspect suspicious texts and URLs.", icon: Link2, color: "red" },
  { id: "history", name: "Scan History", desc: "Review this session's demo checks.", icon: History, color: "teal" },
  { id: "voice", name: "Voice Assistant", desc: "Ask a safety question using your voice.", icon: Mic, color: "violet" }
];

const navItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  ...tools.map(({ id, name, icon }) => ({ id, name, icon }))
];

function App() {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    { from: "ai", text: "Namaste! Main PayRakshak Safety Assistant hoon. Aapko koi suspicious message ya payment mila hai?" }
  ]);
  const [voiceText, setVoiceText] = useState("Your voice assistant is ready.");

  const showResult = (title, text, warning = false) => {
    setResult({ title, text, warning });
  };

  const record = (title, detail, status) => {
    setHistory((old) => [{
      title,
      detail,
      status,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }, ...old]);
  };

  const analyzePayment = (e) => {
    e.preventDefault();
    if (!recipient.trim() || !amount || Number(amount) <= 0) {
      showResult("Details required", "Please enter a valid amount and recipient.", true);
      return;
    }

    const highAmount = Number(amount) >= 50000;
    record("Payment risk check", `₹${Number(amount).toLocaleString("en-IN")} · ${recipient}`, highAmount ? "Review" : "Checked");
    showResult(
      highAmount ? "Extra verification recommended" : "Basic check complete",
      highAmount
        ? "This demo flags larger amounts for extra caution. Verify the recipient independently before paying."
        : "No high-amount warning was triggered. This does not prove the recipient or payment is safe.",
      highAmount
    );
  };

  const analyzeMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showResult("Message required", "Paste an SMS, WhatsApp message or URL first.", true);
      return;
    }

    const suspicious = /otp|upi pin|password|urgent|click here|prize|lottery|account blocked|verify now|pay fee|bit\.ly|tinyurl|remote access/i.test(message);
    record("SMS & link scan", message.slice(0, 70), suspicious ? "Caution" : "Reviewed");
    showResult(
      suspicious ? "Potential warning signs found" : "No listed warning keywords found",
      suspicious
        ? "This text contains wording commonly associated with scams. Do not share OTP/PIN or click unknown links. Verify through the official app."
        : "This simple keyword scan found no listed warning signs. It cannot guarantee that a message or URL is safe.",
      suspicious
    );
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    setChat((old) => [
      ...old,
      { from: "you", text: q },
      { from: "ai", text: "Safety tip: OTP, UPI PIN aur password kisi ke saath share mat karein. Paise receive karne ke liye UPI PIN ki zarurat nahi hoti. Unknown links se bachein aur official payment app mein transaction verify karein. (Demo response — live AI connected nahi hai.)" }
    ]);
    setQuestion("");
  };

  const startVoice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceText("Voice input is not supported here. Please try Chrome or use the chatbot.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "hi-IN";
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setVoiceText("You said: " + text);
      setQuestion(text);
    };
    recognition.onerror = () => setVoiceText("Microphone permission check karein aur dobara try karein.");
    setVoiceText("Listening... Speak now.");
    recognition.start();
  };

  const activeTool = tools.find((tool) => tool.id === active);
  const records = [
    ...history.map((item) => ({ title: item.title, sub: item.detail, status: item.status, time: item.time })),
    { title: "UPI safety check", sub: "Sample dashboard activity", status: "Demo", time: "Earlier" },
    { title: "Message inspection", sub: "Sample dashboard activity", status: "Demo", time: "Earlier" }
  ].filter((item) => `${item.title} ${item.sub} ${item.status}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-shell">
      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <button className="brand" onClick={() => { setActive("dashboard"); setMenuOpen(false); }}>
          <span className="brand-logo"><ShieldCheck size={27} /></span>
          <span className="brand-copy"><strong>PayRakshak <b>AI</b></strong><small>Digital Payment Safety</small></span>
          <X className="close-nav" size={20} />
        </button>

        <p className="nav-label">MAIN MENU</p>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-link ${active === item.id ? "selected" : ""}`} onClick={() => { setActive(item.id); setResult(null); setMenuOpen(false); }}>
              <Icon size={18} /><span>{item.name}</span>{active === item.id && <i />}
            </button>;
          })}
        </nav>

        <div className="sidebar-tip">
          <LockKeyhole size={24} />
          <strong>Stay one step ahead</strong>
          <p>Pause. Verify. Then pay.</p>
          <small>Never share your OTP or UPI PIN with anyone.</small>
        </div>
        <div className="sidebar-footer"><ShieldCheck size={18} /><span><b>PayRakshak AI</b><small>Security prototype · v1.0</small></span></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="welcome">
            <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button>
            <div><span className="eyebrow">YOUR DIGITAL SAFETY SPACE</span><h1>{active === "dashboard" ? "Hello, User! 👋" : activeTool?.name}</h1><p>{active === "dashboard" ? "Your daily shield against digital payment scams." : "Check carefully. Stay protected."}</p></div>
          </div>
          <div className="top-actions"><span className="demo-label"><i /> DEMO MODE</span><button className="bell" onClick={() => showResult("All caught up", "There are no new demo notifications.")} aria-label="Notifications"><Bell size={19} /></button><span className="user-avatar">U</span></div>
        </header>

        <div className="page-content">
          {active === "dashboard" && <>
            <section className="hero">
              <div className="hero-glow" />
              <div className="hero-copy">
                <span className="hero-tag"><Sparkles size={14} /> YOUR PERSONAL SAFETY SHIELD</span>
                <h2>Think smart.<br /><span>Pay safely.</span></h2>
                <p>Suspicious payment? Strange message? Unknown link? Start with a quick safety check.</p>
                <button className="primary-btn" onClick={() => setActive("fraud")}>Start security check <ArrowRight size={17} /></button>
                <div className="hero-foot"><CheckCircle2 size={15} /> Simple tools. Safer decisions.</div>
              </div>
              <div className="shield-art">
                <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                <div className="big-shield"><ShieldCheck size={83} strokeWidth={1.5} /></div>
                <span className="float-icon float-one"><LockKeyhole size={19} /></span>
                <span className="float-icon float-two"><CheckCircle2 size={19} /></span>
                <span className="float-icon float-three"><Activity size={18} /></span>
                <span className="shield-caption"><i /> PROTECTION FIRST</span>
              </div>
              <div className="hero-checks"><b>SAFETY CHECKLIST</b>{["Verify recipient details", "Never share OTP or PIN", "Avoid unknown links", "Use official apps"].map((item) => <span key={item}><CheckCircle2 size={15} />{item}</span>)}</div>
            </section>

            <div className="section-head"><div><span className="eyebrow">OVERVIEW</span><h2>Your security at a glance</h2></div><span className="sample-tag">Illustrative demo stats</span></div>
            <section className="stats-grid">
              <Stat icon={ScanSearch} label="Total scans" value={24 + history.length} color="blue" note="Session activity" />
              <Stat icon={ShieldCheck} label="Safe results" value="18" color="green" note="Sample statistic" />
              <Stat icon={AlertTriangle} label="Needs review" value={4 + history.filter((x) => x.status === "Review" || x.status === "Caution").length} color="red" note="Sample statistic" />
              <Stat icon={Activity} label="Safety checks" value="06" color="purple" note="Available tools" />
            </section>

            <div className="dashboard-grid">
              <section className="panel tools-panel">
                <div className="panel-head"><div><span className="eyebrow">YOUR TOOLKIT</span><h2>Security tools</h2><p>Choose a tool to explore its demo functionality.</p></div><span className="tool-count">06 TOOLS</span></div>
                <div className="tool-grid">{tools.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} onClick={() => setActive(tool.id)} />)}</div>
              </section>
              <div className="right-stack">
                <section className="panel activity-panel">
                  <div className="panel-head small-head"><div><span className="eyebrow">LATEST ACTIVITY</span><h2>Recent checks</h2></div><button className="text-link" onClick={() => setActive("history")}>View all <ArrowUpRight size={14} /></button></div>
                  {[
                    { title: "UPI Payment Check", sub: "Example transaction", status: "Safe", color: "green" },
                    { title: "Screenshot Review", sub: "Example image", status: "Review", color: "orange" },
                    { title: "Suspicious Link Scan", sub: "Example URL", status: "Caution", color: "red" }
                  ].map((item) => <ActivityRow key={item.title} item={item} />)}
                  <small className="sample-note">Sample entries · Not real bank records</small>
                </section>
                <section className="tip-card"><span className="tip-icon"><LockKeyhole size={21} /></span><div><span className="eyebrow">SAFETY TIP / सुरक्षा</span><h3>Pause before you pay.</h3><p>Paise receive karne ke liye UPI PIN kabhi enter na karein.</p><button onClick={() => setActive("chat")}>Learn more <ArrowRight size={14} /></button></div></section>
                <section className="voice-card-small"><span className="voice-small-icon"><Mic size={22} /></span><div><span className="eyebrow">HINDI · ENGLISH</span><h3>Prefer speaking?</h3><p>Ask a safety question out loud.</p><button onClick={() => setActive("voice")}>Try voice assistant <ArrowRight size={14} /></button></div></section>
              </div>
            </div>
          </>}

          {active !== "dashboard" && <section className="workspace">
            <div className="workspace-title"><span className={`workspace-icon ${activeTool?.color || "green"}`}>{activeTool && <activeTool.icon size={26} />}</span><div><span className="eyebrow">PAYRAKSHAK AI TOOL</span><h2>{activeTool?.name}</h2><p>{activeTool?.desc}</p></div></div>

            {active === "fraud" && <form className="form-panel" onSubmit={analyzePayment}><h3>Transaction risk check</h3><p className="muted">Enter payment details for a basic educational demo check.</p><label>Payment amount (₹)<input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 2500" /></label><label>Recipient / merchant<input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter recipient name" /></label><button className="primary-btn" type="submit"><ScanSearch size={17} /> Analyze payment <ArrowRight size={16} /></button><p className="disclaimer"><LockKeyhole size={14} /> Not connected to any bank or payment network.</p></form>}

            {active === "screenshot" && <div className="form-panel"><h3>Screenshot checker</h3><p className="muted">Select an image to begin. Actual authenticity verification needs a configured AI/OCR backend.</p><label className="upload-box"><Upload size={31} /><b>{fileName || "Choose payment screenshot"}</b><small>PNG, JPG or WEBP</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} /></label>{fileName && <p className="success-note"><CheckCircle2 size={16} /> Image selected: {fileName}</p>}<button className="primary-btn" onClick={() => showResult("Verification not connected", "The image is selected, but this demo cannot determine whether a screenshot is genuine. Verify the payment inside your official UPI app or bank statement.", true)}><ScanSearch size={17} /> Review screenshot</button></div>}

            {active === "scanner" && <form className="form-panel" onSubmit={analyzeMessage}><h3>SMS & link scanner</h3><p className="muted">Paste a suspicious message or URL to check common warning signs.</p><label>Message or URL<textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Paste SMS, WhatsApp text or URL here..." /></label><button className="primary-btn" type="submit"><ScanSearch size={17} /> Scan message <ArrowRight size={16} /></button><p className="disclaimer"><AlertTriangle size={14} /> A clean result does not guarantee a link is safe.</p></form>}

            {active === "chat" && <div className="form-panel chat-panel"><h3><Sparkles size={20} /> AI Safety Chat</h3><p className="muted">Hindi / Hinglish / English · Demo responses</p><div className="chat-list">{chat.map((item, i) => <div key={i} className={`chat-message ${item.from}`}>{item.from === "ai" && <ShieldCheck size={16} />}{item.text}</div>)}</div><form className="chat-entry" onSubmit={sendChat}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about payment safety..." /><button aria-label="Send message" type="submit"><Send size={18} /></button></form></div>}

            {active === "history" && <section className="panel history-panel"><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scan history..." /></div>{records.length ? records.map((item, i) => <ActivityRow key={`${item.title}-${i}`} item={{ ...item, color: item.status === "Safe" || item.status === "Checked" ? "green" : "orange" }} />) : <p className="muted">No matching records.</p>}<p className="disclaimer">These are local demo records, not bank data.</p></section>}

            {active === "voice" && <div className="form-panel voice-panel"><div className="voice-orb"><Mic size={39} /></div><span className="eyebrow">VOICE SAFETY COMPANION</span><h3>Ask. Listen. Stay safe.</h3><p className="muted">Try Hindi voice input if your browser supports speech recognition.</p><button className="primary-btn" onClick={startVoice}><Mic size={18} /> Start speaking</button><div className="voice-result">{voiceText}</div>{question && <p className="success-note">Recognized question is ready in the chatbot input. Open AI Safety Chat to send it.</p>}</div>}

            {result && <div className={`result-box ${result.warning ? "warning" : ""}`}><span>{result.warning ? <AlertTriangle /> : <CheckCircle2 />}</span><div><h3>{result.title}</h3><p>{result.text}</p></div><button onClick={() => setResult(null)} aria-label="Close result"><X size={17} /></button></div>}
            <div className="security-note"><LockKeyhole size={16} /><span>Security education prototype. Always verify payments through official apps.</span></div>
          </section>}

          <footer className="page-footer"><span>© 2026 <b>PayRakshak AI</b></span><span><i /> Built for safer digital payments</span><span>HACKATHON PROTOTYPE</span></footer>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color, note }) {
  return <article className={`stat-card ${color}`}><div className="stat-top"><span className="stat-icon"><Icon size={20} /></span><span className="stat-note"><Activity size={12} /> {note}</span></div><p>{label}</p><strong>{value}</strong><div className="stat-bars">{[30, 55, 40, 72, 50, 86, 60, 95].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></article>;
}

function ToolCard({ tool, index, onClick }) {
  const Icon = tool.icon;
  return <button className={`tool-card ${tool.color}`} onClick={onClick}><div className="tool-card-top"><span className="tool-icon"><Icon size={21} /></span><span className="tool-number">0{index + 1}</span></div><h3>{tool.name}</h3><p>{tool.desc}</p><span className="tool-open">Open tool <ArrowUpRight size={14} /></span></button>;
}

function ActivityRow({ item }) {
  return <div className="activity-row"><span className={`activity-icon ${item.color || "green"}`}><ShieldCheck size={16} /></span><div className="activity-copy"><b>{item.title}</b><small>{item.sub || item.detail}</small></div><span className={`status ${item.color || "green"}`}>{item.status}</span>{item.time && <time>{item.time}</time>}</div>;
}

export default App;
