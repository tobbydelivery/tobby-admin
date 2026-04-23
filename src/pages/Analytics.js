import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/analytics?period=${period}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading analytics...</p>;

  const barData = {
    labels: data?.dailyOrders?.map(d => d.date) || [],
    datasets: [{
      label: "Orders",
      data: data?.dailyOrders?.map(d => d.orders) || [],
      backgroundColor: "#e74c3c",
      borderRadius: 8
    }]
  };

  const revenueData = {
    labels: data?.dailyOrders?.map(d => d.date) || [],
    datasets: [{
      label: "Revenue (₦)",
      data: data?.dailyOrders?.map(d => d.revenue) || [],
      borderColor: "#27ae60",
      backgroundColor: "rgba(39,174,96,0.1)",
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div>
          <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px", fontWeight: "800" }}>Analytics</h2>
          <p style={{ color: "#7f8c8d", marginTop: "5px" }}>Business performance insights</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {["today", "week", "month", "year"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "10px 20px", background: period === p ? "#e74c3c" : "#f8f9fa",
              color: period === p ? "white" : "#2c3e50", border: "none",
              borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px"
            }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" }}>
        {[
          { label: "Total Orders", value: data?.summary?.totalOrders, color: "#3498db", bg: "#ebf5fb", icon: "📦" },
          { label: "Total Revenue", value: `₦${data?.summary?.totalRevenue?.toLocaleString()}`, color: "#27ae60", bg: "#eafaf1", icon: "💰" },
          { label: "Success Rate", value: `${data?.summary?.successRate}%`, color: "#9b59b6", bg: "#f3e9fd", icon: "📈" },
          { label: "Avg Rating", value: `⭐ ${data?.summary?.avgRating}`, color: "#f39c12", bg: "#fef9e7", icon: "⭐" }
        ].map((card, i) => (
          <div key={i} style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", borderTop: `4px solid ${card.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#7f8c8d", fontSize: "12px", margin: "0 0 8px", fontWeight: "600", textTransform: "uppercase" }}>{card.label}</p>
                <div style={{ fontSize: "24px", fontWeight: "900", color: card.color }}>{card.value}</div>
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
          <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Daily Orders</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Revenue Trend</h3>
          <Line data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Order Status & Top Locations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Orders by Status</h3>
          {Object.entries(data?.ordersByStatus || {}).map(([status, count], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ color: "#555", textTransform: "capitalize", fontSize: "14px" }}>{status.replace(/_/g, " ")}</span>
              <span style={{ fontWeight: "700", color: "#2c3e50" }}>{count}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Top Delivery Locations</h3>
          {data?.topLocations?.length === 0 ? (
            <p style={{ color: "#7f8c8d" }}>No data yet</p>
          ) : (
            data?.topLocations?.map((loc, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#555", fontSize: "14px" }}>📍 {loc.location}</span>
                <span style={{ fontWeight: "700", color: "#e74c3c" }}>{loc.count} orders</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;