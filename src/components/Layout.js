import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/orders", label: "Orders", icon: "📦" },
    { path: "/agents", label: "Agents", icon: "🚚" },
    { path: "/users", label: "Users", icon: "👥" },
    { path: "/payments", label: "Payments", icon: "💰" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        background: "#2c3e50",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh"
      }}>
        {/* Logo */}
        <div style={{ padding: "25px 20px", borderBottom: "1px solid #34495e" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>🚚 Tobby Delivery</h2>
          <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#95a5a6" }}>Admin Dashboard</p>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "20px 0" }}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: "14px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: location.pathname === item.path ? "#3498db" : "transparent",
                borderLeft: location.pathname === item.path ? "4px solid white" : "4px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "15px" }}>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User info & logout */}
        <div style={{ padding: "20px", borderTop: "1px solid #34495e" }}>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontWeight: "bold" }}>{user?.name}</div>
            <div style={{ fontSize: "12px", color: "#95a5a6" }}>{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "250px", flex: 1, padding: "30px" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;