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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/agents/users");
      setUsers(res.data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleColors = { admin: "#9b59b6", agent: "#3498db", user: "#27ae60" };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "900" }}>Users Management</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "13px" }}>{users.length} registered users</p>
      </div>

      {/* Filters */}
      <div style={{ ...glassStyle, padding: "18px 20px", marginBottom: "20px", display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px", borderRadius: "12px", border: `1.5px solid ${searchFocused ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ width: "100%", padding: "11px 12px 11px 36px", background: "transparent", border: "none", outline: "none", color: "white", fontSize: "13px", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "admin", "agent", "user"].map(role => (
            <button key={role} onClick={() => setRoleFilter(role)} style={{ padding: "8px 16px", background: roleFilter === role ? "rgba(231,76,60,0.8)" : "rgba(255,255,255,0.06)", color: "white", border: roleFilter === role ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: roleFilter === role ? "700" : "500" }}>
              {role.toUpperCase()}
            </button>
          ))}
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{filteredUsers.length} results</span>
      </div>

      <div style={{ ...glassStyle, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["User", "Email", "Phone", "Role", "Status", "Joined"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(6).fill(0).map((_, j) => (
                    <td key={j} style={{ padding: "14px 20px" }}>
                      <div style={{ height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredUsers.map((user, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `linear-gradient(135deg, ${roleColors[user.role] || "#555"}, ${roleColors[user.role] || "#333"})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "13px", color: "white" }}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: "700", fontSize: "13px", color: "white" }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 20px", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{user.email}</td>
                <td style={{ padding: "13px 20px", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{user.phone || "—"}</td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ background: `${roleColors[user.role] || "#555"}20`, color: roleColors[user.role] || "#fff", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: `1px solid ${roleColors[user.role] || "#555"}40` }}>{user.role}</span>
                </td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ background: user.isActive ? "rgba(39,174,96,0.2)" : "rgba(231,76,60,0.2)", color: user.isActive ? "#27ae60" : "#e74c3c", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: `1px solid ${user.isActive ? "rgba(39,174,96,0.3)" : "rgba(231,76,60,0.3)"}` }}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "13px 20px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredUsers.length === 0 && (
          <div style={{ padding: "50px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>👥</div>
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;