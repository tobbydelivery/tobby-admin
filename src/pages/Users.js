import React, { useState, useEffect } from "react";
import API from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/agents/users");
      setUsers(res.data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ padding: "20px" }}>Loading users...</p>;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px", fontWeight: "800" }}>Users Management</h2>
        <p style={{ color: "#7f8c8d", marginTop: "5px" }}>Manage all registered users</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "20px 25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "12px 16px", border: "2px solid #ecf0f1", borderRadius: "10px", fontSize: "14px", width: "320px", outline: "none" }} />
      </div>

      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["User", "Email", "Phone", "Role", "Status", "Joined"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", color: "#2c3e50", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: user.role === "admin" ? "#9b59b6" : user.role === "agent" ? "#3498db" : "#27ae60", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" }}>
                      {user.name?.charAt(0)}
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{user.name}</div>
                  </div>
                </td>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555" }}>{user.email}</td>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555" }}>{user.phone || "N/A"}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ background: user.role === "admin" ? "#f3e9fd" : user.role === "agent" ? "#ebf5fb" : "#eafaf1", color: user.role === "admin" ? "#9b59b6" : user.role === "agent" ? "#3498db" : "#27ae60", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ background: user.isActive ? "#eafaf1" : "#fdedec", color: user.isActive ? "#27ae60" : "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#7f8c8d" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <div style={{ padding: "50px", textAlign: "center", color: "#7f8c8d" }}>No users found</div>}
      </div>
    </div>
  );
};

export default Users;