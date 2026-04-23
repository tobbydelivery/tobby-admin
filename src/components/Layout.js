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
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/discounts", label: "Discounts", icon: "🏷️" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: "260px",
        background: "linear-gradient(180deg, #1a252f 0%, #2c3e50 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        boxShadow: "4px 0 20px rgba(0,0,0,0.15)"
      }}>
        {/* Logo */}
        <div style={{ padding: "30px 25px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "30px" }}>🚚</span>
            <div>
              <div style={{ fontWeight: "800", fontSize: "18px", letterSpacing: "0.5px" }}>STeX Logistics</div>
              <div style={{ color: "#e74c3c", fontSize: "10px", letterSpacing: "2px" }}>ADMIN PORTAL</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "20px 0" }}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: "14px 25px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: location.pathname === item.path ? "rgba(231,76,60,0.2)" : "transparent",
                borderLeft: location.pathname === item.path ? "4px solid #e74c3c" : "4px solid transparent",
                transition: "all 0.2s",
                marginBottom: "4px"
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "15px", fontWeight: location.pathname === item.path ? "600" : "400" }}>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User info & logout */}
        <div style={{ padding: "20px 25px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px" }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "14px" }}>{user?.name}</div>
              <div style={{ fontSize: "11px", color: "#95a5a6" }}>{user?.role?.toUpperCase()}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "10px", background: "#e74c3c",
              color: "white", border: "none", borderRadius: "8px",
              cursor: "pointer", fontWeight: "600", fontSize: "14px"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "260px", flex: 1, padding: "30px" }}>
        {/* Top Bar */}
        <div style={{ background: "white", borderRadius: "12px", padding: "15px 25px", marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "14px", color: "#7f8c8d" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27ae60" }}></div>
            <span style={{ fontSize: "13px", color: "#27ae60", fontWeight: "600" }}>System Online</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;