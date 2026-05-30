import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊", desc: "Overview & stats" },
    { path: "/orders", label: "Orders", icon: "📦", desc: "Manage deliveries" },
    { path: "/agents", label: "Agents", icon: "🚚", desc: "Delivery agents" },
    { path: "/users", label: "Users", icon: "👥", desc: "Registered users" },
    { path: "/payments", label: "Payments", icon: "💰", desc: "Transactions" },
    { path: "/analytics", label: "Analytics", icon: "📈", desc: "Business insights" },
    { path: "/discounts", label: "Discounts", icon: "🏷️", desc: "Promo codes" },
  ];

  const handleLogout = () => { logout(); navigate("/"); };

  const sidebarWidth = collapsed ? "72px" : "260px";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: `linear-gradient(rgba(0,0,0,0.88), rgba(0,0,0,0.88)), url('https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: sidebarWidth,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        zIndex: 200,
        transition: "width 0.3s ease",
        overflow: "hidden",
        boxShadow: "4px 0 32px rgba(0,0,0,0.4)"
      }}>

        {/* Logo */}
        <div style={{
          padding: collapsed ? "24px 16px" : "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "12px"
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #e74c3c, #c0392b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, boxShadow: "0 4px 12px rgba(231,76,60,0.4)" }}>🚚</div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "15px", color: "white" }}>STeX Logistics</div>
                <div style={{ color: "#e74c3c", fontSize: "9px", letterSpacing: "2px" }}>ADMIN PORTAL</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #e74c3c, #c0392b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 4px 12px rgba(231,76,60,0.4)" }}>🚚</div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", width: "28px", height: "28px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === item.path;
            return (
              <div key={item.path}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                title={collapsed ? item.label : ""}
                style={{
                  padding: collapsed ? "12px" : "11px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderRadius: "12px",
                  marginBottom: "4px",
                  background: isActive ? "rgba(231,76,60,0.2)" : isHovered ? "rgba(255,255,255,0.06)" : "transparent",
                  border: isActive ? "1px solid rgba(231,76,60,0.3)" : "1px solid transparent",
                  transition: "all 0.2s",
                  justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative"
                }}>
                {isActive && <div style={{ position: "absolute", left: 0, top: "25%", height: "50%", width: "3px", background: "#e74c3c", borderRadius: "0 3px 3px 0" }} />}
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && (
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: isActive ? "700" : "500", color: isActive ? "white" : "rgba(255,255,255,0.7)" }}>{item.label}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {!collapsed && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "12px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #e74c3c, #c0392b)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", color: "white", flexShrink: 0 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#27ae60", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: "10px", color: "#27ae60", fontWeight: "600" }}>{user?.role?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            style={{
              width: "100%", padding: "10px",
              background: "rgba(231,76,60,0.15)",
              color: "#e74c3c",
              border: "1px solid rgba(231,76,60,0.3)",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.target.style.background = "rgba(231,76,60,0.25)"; }}
            onMouseLeave={e => { e.target.style.background = "rgba(231,76,60,0.15)"; }}
          >
            {collapsed ? "🚪" : "🚪 Sign Out"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarWidth, flex: 1, padding: "24px", transition: "margin-left 0.3s ease", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "14px 24px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
        }}>
          <div>
            <div style={{ fontSize: "15px", color: "white", fontWeight: "700" }}>
              {menuItems.find(m => m.path === location.pathname)?.label || "Dashboard"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(39,174,96,0.15)", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(39,174,96,0.3)" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#27ae60", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "12px", color: "#27ae60", fontWeight: "700" }}>System Online</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #e74c3c, #c0392b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "white" }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ animation: "slideIn 0.3s ease" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;