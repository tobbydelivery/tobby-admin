import React, { useState, useEffect } from "react";
import API from "../services/api";

const glassStyle = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
};

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [focused, setFocused] = useState({});

  useEffect(() => { fetchAgents(); }, []);

  const fetchAgents = async () => {
    try {
      const res = await API.get("/agents");
      setAgents(res.data.agents);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const createAgent = async (e) => {
    e.preventDefault();
    try {
      await API.post("/agents", { ...form, role: "agent" });
      setMessage({ text: "Agent created successfully!", type: "success" });
      setForm({ name: "", email: "", password: "", phone: "" });
      setShowForm(false);
      fetchAgents();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || "Error creating agent", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const inputStyle = (key) => ({
    width: "100%", padding: "12px 14px 12px 42px",
    background: "transparent", border: "none", outline: "none",
    color: "white", fontSize: "14px", boxSizing: "border-box"
  });

  const fieldWrap = (key) => ({
    position: "relative", borderRadius: "12px",
    border: `1.5px solid ${focused[key] ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`,
    background: "rgba(255,255,255,0.05)",
    transition: "all 0.2s",
    boxShadow: focused[key] ? "0 0 0 3px rgba(231,76,60,0.1)" : "none"
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "900" }}>Agents Management</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "13px" }}>{agents.length} delivery agents registered</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "11px 22px", background: showForm ? "rgba(231,76,60,0.2)" : "linear-gradient(135deg, #27ae60, #1e8449)", color: showForm ? "#e74c3c" : "white", border: showForm ? "1px solid rgba(231,76,60,0.4)" : "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: showForm ? "none" : "0 6px 20px rgba(39,174,96,0.35)" }}>
          {showForm ? "✕ Cancel" : "+ Add New Agent"}
        </button>
      </div>

      {message.text && (
        <div style={{ background: message.type === "success" ? "rgba(39,174,96,0.15)" : "rgba(231,76,60,0.15)", border: `1px solid ${message.type === "success" ? "rgba(39,174,96,0.4)" : "rgba(231,76,60,0.4)"}`, borderRadius: "14px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{message.type === "success" ? "✅" : "⚠️"}</span>
          <span style={{ color: message.type === "success" ? "#27ae60" : "#e74c3c", fontWeight: "600", fontSize: "14px" }}>{message.text}</span>
        </div>
      )}

      {showForm && (
        <div style={{ ...glassStyle, padding: "28px", marginBottom: "24px", animation: "fadeUp 0.3s ease" }}>
          <h3 style={{ color: "white", margin: "0 0 20px", fontWeight: "800", fontSize: "16px" }}>Create New Delivery Agent</h3>
          <form onSubmit={createAgent}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Full Name", key: "name", icon: "👤", type: "text" },
                { label: "Email Address", key: "email", icon: "📧", type: "email" },
                { label: "Phone Number", key: "phone", icon: "📞", type: "text" },
                { label: "Password", key: "password", icon: "🔒", type: "password" }
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", marginBottom: "7px", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px" }}>{field.label.toUpperCase()}</label>
                  <div style={fieldWrap(field.key)}>
                    <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>{field.icon}</span>
                    <input type={field.type} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} onFocus={() => setFocused({ ...focused, [field.key]: true })} onBlur={() => setFocused({ ...focused, [field.key]: false })} required style={inputStyle(field.key)} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button type="submit" style={{ padding: "12px 28px", background: "linear-gradient(135deg, #27ae60, #1e8449)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 6px 20px rgba(39,174,96,0.35)" }}>Create Agent →</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ ...glassStyle, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "white", margin: 0, fontSize: "15px", fontWeight: "800" }}>All Agents</h3>
          <span style={{ background: "rgba(52,152,219,0.2)", color: "#3498db", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid rgba(52,152,219,0.3)" }}>{agents.length} Total</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Agent", "Email", "Phone", "Status", "Joined"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(5).fill(0).map((_, j) => (
                    <td key={j} style={{ padding: "14px 20px" }}>
                      <div style={{ height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : agents.map((agent, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #3498db, #2980b9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", color: "white" }}>
                      {agent.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: "700", fontSize: "14px", color: "white" }}>{agent.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{agent.email}</td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{agent.phone || "—"}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ background: agent.isActive ? "rgba(39,174,96,0.2)" : "rgba(231,76,60,0.2)", color: agent.isActive ? "#27ae60" : "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: `1px solid ${agent.isActive ? "rgba(39,174,96,0.3)" : "rgba(231,76,60,0.3)"}` }}>
                    {agent.isActive ? "● Active" : "● Inactive"}
                  </span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{new Date(agent.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && agents.length === 0 && (
          <div style={{ padding: "50px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🚚</div>
            <p>No agents registered yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;