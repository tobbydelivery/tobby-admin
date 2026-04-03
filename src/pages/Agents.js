import React, { useState, useEffect } from "react";
import API from "../services/api";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await API.get("/agents");
      setAgents(res.data.agents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (e) => {
    e.preventDefault();
    try {
      await API.post("/agents", { ...form, role: "agent" });
      setMessage("Agent created successfully!");
      setForm({ name: "", email: "", password: "", phone: "" });
      setShowForm(false);
      fetchAgents();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating agent");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading agents...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h2 style={{ color: "#2c3e50" }}>🚚 Agents Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            background: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          + Add New Agent
        </button>
      </div>

      {message && (
        <div style={{
          background: message.includes("success") ? "#d4edda" : "#fee",
          color: message.includes("success") ? "#27ae60" : "#e74c3c",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "20px"
        }}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: "25px"
        }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Create New Agent</h3>
          <form onSubmit={createAgent}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#2c3e50" }}>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "6px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#2c3e50" }}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "6px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#2c3e50" }}>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "6px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#2c3e50" }}>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "6px", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 25px",
                  background: "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Create Agent
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "10px 25px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Agents Table */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "white" }}>
              <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ecf0f1", background: i % 2 === 0 ? "white" : "#f8f9fa" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{agent.name}</td>
                <td style={{ padding: "12px" }}>{agent.email}</td>
                <td style={{ padding: "12px" }}>{agent.phone || "N/A"}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: agent.isActive ? "#27ae60" : "#e74c3c",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{new Date(agent.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#7f8c8d" }}>
            No agents found
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;