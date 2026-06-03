import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Skeleton component
const Skeleton = ({ width = "100%", height = "16px", borderRadius = "8px" }) => (
  <div style={{
    width, height, borderRadius,
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite"
  }} />
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/orders");
      const orders = res.data.orders;
      setOrders(orders);
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === "pending").length,
        deliveredOrders: orders.filter(o => o.status === "delivered").length,
        totalRevenue: orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + (o.price || 0), 0)
      });
      setRecentOrders(orders.slice(0, 6));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getStatusColor = (status) => {
    const colors = { pending: "#f39c12", picked_up: "#3498db", in_transit: "#9b59b6", delivered: "#27ae60", cancelled: "#e74c3c", delayed: "#e67e22" };
    return colors[status] || "#95a5a6";
  };

  const statusCounts = {
    pending: orders.filter(o => o.status === "pending").length,
    picked_up: orders.filter(o => o.status === "picked_up").length,
    in_transit: orders.filter(o => o.status === "in_transit").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const glassStyle = {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
  };

  const barData = {
    labels: ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"],
    datasets: [{
      label: "Orders",
      data: Object.values(statusCounts),
      backgroundColor: ["rgba(243,156,18,0.7)", "rgba(52,152,219,0.7)", "rgba(155,89,182,0.7)", "rgba(39,174,96,0.7)", "rgba(231,76,60,0.7)"],
      borderColor: ["#f39c12", "#3498db", "#9b59b6", "#27ae60", "#e74c3c"],
      borderWidth: 2,
      borderRadius: 10,
      borderSkipped: false
    }]
  };

  const doughnutData = {
    labels: ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"],
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ["rgba(243,156,18,0.8)", "rgba(52,152,219,0.8)", "rgba(155,89,182,0.8)", "rgba(39,174,96,0.8)", "rgba(231,76,60,0.8)"],
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "white",
        bodyColor: "rgba(255,255,255,0.7)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "rgba(255,255,255,0.6)", padding: 16, font: { size: 11 } }
      }
    },
    cutout: "65%"
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px", animation: "fadeUp 0.4s ease" }}>
        <h2 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "900" }}>Dashboard Overview</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "13px" }}>
          Welcome back, {/* user name will come from context */} here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ ...glassStyle, padding: "22px" }}>
              <Skeleton width="60%" height="12px" />
              <div style={{ marginTop: "10px" }}><Skeleton width="40%" height="28px" /></div>
              <div style={{ marginTop: "8px" }}><Skeleton width="80%" height="10px" /></div>
            </div>
          ))
        ) : (
          [
            { title: "Total Orders", value: stats.totalOrders, color: "#3498db", icon: "📦", change: "+12% this week" },
            { title: "Pending", value: stats.pendingOrders, color: "#f39c12", icon: "⏳", change: "Needs attention" },
            { title: "Delivered", value: stats.deliveredOrders, color: "#27ae60", icon: "✅", change: "99% success rate" },
            { title: "Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, color: "#e74c3c", icon: "💰", change: "Total earned" }
          ].map((card, i) => (
            <div key={i} style={{
              ...glassStyle,
              padding: "22px",
              borderTop: `2px solid ${card.color}40`,
              animation: `fadeUp ${0.3 + i * 0.1}s ease`,
              transition: "transform 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", margin: "0 0 8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{card.title}</p>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: card.color }}>{card.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "6px" }}>{card.change}</div>
                </div>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "14px",
                  background: `${card.color}20`,
                  border: `1px solid ${card.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px"
                }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ marginTop: "14px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min((card.value / (stats.totalOrders || 1)) * 100, 100)}%`, background: `linear-gradient(90deg, ${card.color}, ${card.color}80)`, borderRadius: "2px" }} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Status Badges */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} style={{
            background: `${getStatusColor(status)}15`,
            border: `1px solid ${getStatusColor(status)}30`,
            borderRadius: "20px",
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getStatusColor(status) }} />
            <span style={{ fontSize: "12px", color: getStatusColor(status), fontWeight: "700" }}>
              {status.replace(/_/g, " ").toUpperCase()}: {count}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ ...glassStyle, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ color: "white", margin: "0 0 3px", fontWeight: "800", fontSize: "15px" }}>Orders by Status</h3>
              <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: "12px" }}>Current order distribution</p>
            </div>
          </div>
          {loading ? <Skeleton height="200px" /> : <Bar data={barData} options={chartOptions} />}
        </div>

        <div style={{ ...glassStyle, padding: "24px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "white", margin: "0 0 3px", fontWeight: "800", fontSize: "15px" }}>Distribution</h3>
            <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: "12px" }}>Visual breakdown</p>
          </div>
          {loading ? <Skeleton height="200px" borderRadius="50%" /> : (
            <div>
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <div style={{ fontSize: "22px", fontWeight: "900", color: "white" }}>{stats.totalOrders}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Total Orders</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{ ...glassStyle, padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ color: "white", margin: "0 0 3px", fontWeight: "800", fontSize: "15px" }}>Recent Orders</h3>
            <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: "12px" }}>Latest 6 orders across all statuses</p>
          </div>
          <span style={{ background: "rgba(231,76,60,0.2)", color: "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid rgba(231,76,60,0.3)" }}>
            Live
          </span>
        </div>

        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "20px", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Skeleton width="120px" height="14px" />
              <Skeleton width="100px" height="14px" />
              <Skeleton width="100px" height="14px" />
              <Skeleton width="80px" height="22px" borderRadius="20px" />
              <Skeleton width="70px" height="14px" />
            </div>
          ))
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Tracking #", "Sender", "Recipient", "Status", "Price", "Date"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 14px", color: "#3498db", fontWeight: "800", fontSize: "13px" }}>{order.trackingNumber}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ fontSize: "13px", color: "white", fontWeight: "600" }}>{order.sender?.name}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{order.sender?.phone}</div>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ fontSize: "13px", color: "white", fontWeight: "600" }}>{order.recipient?.name}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{order.recipient?.phone}</div>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                        border: `1px solid ${getStatusColor(order.status)}40`
                      }}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "13px 14px", fontWeight: "800", color: "#27ae60", fontSize: "13px" }}>
                      ₦{(order.price || 2500).toLocaleString()}
                    </td>
                    <td style={{ padding: "13px 14px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>📭</div>
                <p>No orders yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;