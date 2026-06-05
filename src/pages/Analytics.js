import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const glassStyle = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => { fetchAnalytics(); }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/analytics?period=${period}`);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "rgba(0,0,0,0.8)", titleColor: "white", bodyColor: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, padding: 12 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: "rgba(255,255,255,0.5)", font: { size: 10 } } }
    }
  };

  const barData = {
    labels: data?.dailyOrders?.map(d => d.date) || [],
    datasets: [{ label: "Orders", data: data?.dailyOrders?.map(d => d.orders) || [], backgroundColor: "rgba(231,76,60,0.6)", borderColor: "#e74c3c", borderWidth: 2, borderRadius: 8, borderSkipped: false }]
  };

  const revenueData = {
    labels: data?.dailyOrders?.map(d => d.date) || [],
    datasets: [{ label: "Revenue (₦)", data: data?.dailyOrders?.map(d => d.revenue) || [], borderColor: "#27ae60", backgroundColor: "rgba(39,174,96,0.1)", fill: true, tension: 0.4, pointBackgroundColor: "#27ae60", pointRadius: 4 }]
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "900" }}>Analytics</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "13px" }}>Business performance insights</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["today", "week", "month", "year"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "9px 18px", background: period === p ? "rgba(231,76,60,0.8)" : "rgba(255,255,255,0.06)", color: "white", border: period === p ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", cursor: "pointer", fontWeight: period === p ? "700" : "500", fontSize: "13px" }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} style={{ ...glassStyle, padding: "22px" }}>
            <div style={{ height: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", marginBottom: "10px" }} />
            <div style={{ height: "28px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", width: "60%" }} />
          </div>
        )) : [
          { label: "Total Orders", value: data?.summary?.totalOrders, color: "#3498db", icon: "📦" },
          { label: "Total Revenue", value: `₦${data?.summary?.totalRevenue?.toLocaleString()}`, color: "#27ae60", icon: "💰" },
          { label: "Success Rate", value: `${data?.summary?.successRate}%`, color: "#9b59b6", icon: "📈" },
          { label: "Avg Rating", value: `⭐ ${data?.summary?.avgRating}`, color: "#f39c12", icon: "⭐" }
        ].map((card, i) => (
          <div key={i} style={{ ...glassStyle, padding: "22px", borderTop: `2px solid ${card.color}40`, animation: `fadeUp ${0.2 + i * 0.1}s ease` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "0 0 8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{card.label}</p>
                <div style={{ fontSize: "24px", fontWeight: "900", color: card.color }}>{card.value}</div>
              </div>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: `${card.color}15`, border: `1px solid ${card.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div style={{ ...glassStyle, padding: "24px" }}>
          <h3 style={{ color: "white", margin: "0 0 4px", fontWeight: "800", fontSize: "15px" }}>Daily Orders</h3>
          <p style={{ color: "rgba(255,255,255,0.35)", margin: "0 0 20px", fontSize: "12px" }}>Orders per day this {period}</p>
          {loading ? <div style={{ height: "200px", background: "rgba(255,255,255,0.04)", borderRadius: "12px" }} /> : <Bar data={barData} options={chartOptions} />}
        </div>
        <div style={{ ...glassStyle, padding: "24px" }}>
          <h3 style={{ color: "white", margin: "0 0 4px", fontWeight: "800", fontSize: "15px" }}>Revenue Trend</h3>
          <p style={{ color: "rgba(255,255,255,0.35)", margin: "0 0 20px", fontSize: "12px" }}>Earnings over time</p>
          {loading ? <div style={{ height: "200px", background: "rgba(255,255,255,0.04)", borderRadius: "12px" }} /> : <Line data={revenueData} options={chartOptions} />}
        </div>
      </div>

      {/* Status & Locations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ ...glassStyle, padding: "24px" }}>
          <h3 style={{ color: "white", margin: "0 0 16px", fontWeight: "800", fontSize: "15px" }}>Orders by Status</h3>
          {Object.entries(data?.ordersByStatus || {}).map(([status, count], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", textTransform: "capitalize" }}>{status.replace(/_/g, " ")}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "80px", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(count / (data?.summary?.totalOrders || 1)) * 100}%`, background: "#e74c3c", borderRadius: "2px" }} />
                </div>
                <span style={{ color: "white", fontWeight: "800", fontSize: "14px", minWidth: "20px" }}>{count}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...glassStyle, padding: "24px" }}>
          <h3 style={{ color: "white", margin: "0 0 16px", fontWeight: "800", fontSize: "15px" }}>Top Delivery Locations</h3>
          {data?.topLocations?.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "rgba(255,255,255,0.3)" }}>
              <p>No location data yet</p>
            </div>
          ) : data?.topLocations?.map((loc, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>📍</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{loc.location}</span>
              </div>
              <span style={{ color: "#e74c3c", fontWeight: "800", fontSize: "14px" }}>{loc.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;