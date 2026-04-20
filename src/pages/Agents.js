import React, { useState, useEffect } from "react";
import API from "../services/api";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState("");

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
      setMessage("Agent created successfully!");
      setForm({ name: "", email: "", password: "", phone: "" });
      setShowForm(false);
      fetchAgents();
    } catch (err) { setMessage(err.response?.data?.error || "Error creating agent"); }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading agents...</p>;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div>
          <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px", fontWeight: "800" }}>Agents Management</h2>
          <p style={{ color: "#7f8c8d", marginTop: "5px" }}>Manage your delivery agents</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "12px 24px", background: "#27ae60", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 15px rgba(39,174,96,0.3)" }}>
          + Add New Agent
        </button>
      </div>

      {message && (
        <div style={{ background: message.includes("success") ? "#eafaf1" : "#fdedec", color: message.includes("success") ? "#27ae60" : "#e74c3c", padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", borderLeft: `4px solid ${message.includes("success") ? "#27ae60" : "#e74c3c"}` }}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", marginBottom: "25px" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "25px", fontWeight: "700" }}>Create New Agent</h3>
          <form onSubmit={createAgent}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                { label: "Email", key: "email", type: "email", placeholder: "agent@stexlogistics.com" },
                { label: "Phone Number", key: "phone", type: "text", placeholder: "08012345678" },
                { label: "Password", key: "password", type: "password", placeholder: "••••••••" }
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", marginBottom: "8px", color: "#2c3e50", fontWeight: "600", fontSize: "14px" }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required placeholder={field.placeholder}
                    style={{ width: "100%", padding: "12px 14px", border: "2px solid #ecf0f1", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <button type="submit" style={{ padding: "12px 28px", background: "#27ae60", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>Create Agent</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "12px 28px", background: "#ecf0f1", color: "#2c3e50", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Agent", "Email", "Phone", "Status", "Joined"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", color: "#2c3e50", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#3498db", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" }}>
                      {agent.name?.charAt(0)}
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{agent.name}</div>
                  </div>
                </td>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555" }}>{agent.email}</td>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555" }}>{agent.phone || "N/A"}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ background: agent.isActive ? "#eafaf1" : "#fdedec", color: agent.isActive ? "#27ae60" : "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#7f8c8d" }}>{new Date(agent.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && <div style={{ padding: "50px", textAlign: "center", color: "#7f8c8d" }}>No agents found</div>}
      </div>
    </div>
  );
};

export default Agents;