import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/orders");
      const orders = res.data.orders;
      setOrders(orders);

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const deliveredOrders = orders.filter(o => o.status === "delivered").length;
      const totalRevenue = orders
        .filter(o => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + (o.price || 0), 0);

      setStats({ totalOrders, pendingOrders, deliveredOrders, totalRevenue });
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, color: "#3498db", icon: "📦" },
    { title: "Pending", value: stats.pendingOrders, color: "#f39c12", icon: "⏳" },
    { title: "Delivered", value: stats.deliveredOrders, color: "#27ae60", icon: "✅" },
    { title: "Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, color: "#9b59b6", icon: "💰" }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f39c12",
      picked_up: "#3498db",
      in_transit: "#9b59b6",
      delivered: "#27ae60",
      cancelled: "#e74c3c",
      delayed: "#e67e22"
    };
    return colors[status] || "#95a5a6";
  };

  // Chart data
  const statusCounts = {
    pending: orders.filter(o => o.status === "pending").length,
    picked_up: orders.filter(o => o.status === "picked_up").length,
    in_transit: orders.filter(o => o.status === "in_transit").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const doughnutData = {
    labels: ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"],
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ["#f39c12", "#3498db", "#9b59b6", "#27ae60", "#e74c3c"],
      borderWidth: 0
    }]
  };

  const barData = {
    labels: ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"],
    datasets: [{
      label: "Orders by Status",
      data: Object.values(statusCounts),
      backgroundColor: ["#f39c12", "#3498db", "#9b59b6", "#27ae60", "#e74c3c"],
      borderRadius: 6
    }]
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
      <p style={{ fontSize: "18px", color: "#7f8c8d" }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div>
      <h2 style={{ color: "#2c3e50", marginBottom: "30px" }}>📊 Dashboard Overview</h2>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: "white",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            borderLeft: `4px solid ${card.color}`
          }}>
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>{card.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: card.color }}>{card.value}</div>
            <div style={{ color: "#7f8c8d", marginTop: "5px" }}>{card.title}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Orders by Status</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div style={{ background: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Order Distribution</h3>
          <Doughnut data={doughnutData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Recent Orders</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ padding: "12px", textAlign: "left", color: "#2c3e50" }}>Tracking #</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#2c3e50" }}>Sender</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#2c3e50" }}>Recipient</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#2c3e50" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#2c3e50" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ecf0f1" }}>
                <td style={{ padding: "12px", color: "#3498db", fontWeight: "bold" }}>{order.trackingNumber}</td>
                <td style={{ padding: "12px" }}>{order.sender?.name}</td>
                <td style={{ padding: "12px" }}>{order.recipient?.name}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: getStatusColor(order.status),
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>₦{order.price || 2500}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;