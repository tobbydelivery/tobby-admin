import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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
      setRecentOrders(orders.slice(0, 5));
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

  const doughnutData = {
    labels: ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"],
    datasets: [{ data: Object.values(statusCounts), backgroundColor: ["#f39c12", "#3498db", "#9b59b6", "#27ae60", "#e74c3c"], borderWidth: 0 }]
  };

  const barData = {
    labels: ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"],
    datasets: [{ label: "Orders", data: Object.values(statusCounts), backgroundColor: ["#f39c12", "#3498db", "#9b59b6", "#27ae60", "#e74c3c"], borderRadius: 8 }]
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "15px" }}>⏳</div>
        <p style={{ color: "#7f8c8d", fontSize: "16px" }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px", fontWeight: "800" }}>Dashboard Overview</h2>
        <p style={{ color: "#7f8c8d", marginTop: "5px" }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" }}>
        {[
          { title: "Total Orders", value: stats.totalOrders, color: "#3498db", icon: "📦", bg: "#ebf5fb" },
          { title: "Pending", value: stats.pendingOrders, color: "#f39c12", icon: "⏳", bg: "#fef9e7" },
          { title: "Delivered", value: stats.deliveredOrders, color: "#27ae60", icon: "✅", bg: "#eafaf1" },
          { title: "Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, color: "#e74c3c", icon: "💰", bg: "#fdedec" }
        ].map((card, i) => (
          <div key={i} style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", borderTop: `4px solid ${card.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#7f8c8d", fontSize: "13px", margin: "0 0 8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.title}</p>
                <div style={{ fontSize: "28px", fontWeight: "900", color: card.color }}>{card.value}</div>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Orders by Status</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Order Distribution</h3>
          <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
        <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Recent Orders</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Tracking #", "Sender", "Recipient", "Status", "Price"].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: "#2c3e50", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "14px 15px", color: "#3498db", fontWeight: "700", fontSize: "14px" }}>{order.trackingNumber}</td>
                <td style={{ padding: "14px 15px", fontSize: "14px" }}>{order.sender?.name}</td>
                <td style={{ padding: "14px 15px", fontSize: "14px" }}>{order.recipient?.name}</td>
                <td style={{ padding: "14px 15px" }}>
                  <span style={{ background: getStatusColor(order.status), color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td style={{ padding: "14px 15px", fontWeight: "700", color: "#27ae60" }}>₦{order.price || 2500}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;