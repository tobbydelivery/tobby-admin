import React, { useState, useEffect } from "react";
import API from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/agents/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ padding: "20px" }}>Loading users...</p>;

  return (
    <div>
      <h2 style={{ color: "#2c3e50", marginBottom: "25px" }}>👥 Users Management</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px 15px",
          border: "2px solid #ecf0f1",
          borderRadius: "6px",
          fontSize: "14px",
          width: "300px",
          marginBottom: "20px"
        }}
      />

      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "white" }}>
              <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ecf0f1", background: i % 2 === 0 ? "white" : "#f8f9fa" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{user.name}</td>
                <td style={{ padding: "12px" }}>{user.email}</td>
                <td style={{ padding: "12px" }}>{user.phone || "N/A"}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: user.role === "admin" ? "#9b59b6" : user.role === "agent" ? "#3498db" : "#27ae60",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: user.isActive ? "#27ae60" : "#e74c3c",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#7f8c8d" }}>
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;