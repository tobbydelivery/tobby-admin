import React, { useState, useEffect } from "react";
import API from "../services/api";

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredOrders = orders.filter(order => filter === "all" || order.paymentStatus === filter);
  const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + (o.price || 0), 0);
  const pendingRevenue = orders.filter(o => o.paymentStatus === "unpaid").reduce((sum, o) => sum + (o.price || 0), 0);

  if (loading) return <p style={{ padding: "20px" }}>Loading payments...</p>;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px", fontWeight: "800" }}>Payments</h2>
        <p style={{ color: "#7f8c8d", marginTop: "5px" }}>Track all transactions and revenue</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "25px" }}>
        {[
          { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, color: "#27ae60", bg: "#eafaf1", icon: "💰" },
          { label: "Pending Revenue", value: `₦${pendingRevenue.toLocaleString()}`, color: "#e74c3c", bg: "#fdedec", icon: "⏳" },
          { label: "Total Transactions", value: orders.length, color: "#3498db", bg: "#ebf5fb", icon: "📊" }
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "55px", height: "55px", borderRadius: "14px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#7f8c8d", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
              <div style={{ fontSize: "26px", fontWeight: "900", color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "20px 25px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", marginBottom: "20px", display: "flex", gap: "10px" }}>
        {["all", "paid", "unpaid", "pending"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "10px 20px", background: filter === s ? "#e74c3c" : "#f8f9fa", color: filter === s ? "white" : "#2c3e50", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Tracking #", "Customer", "Amount", "Payment", "Order Status", "Date"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", color: "#2c3e50", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "14px 18px", color: "#3498db", fontWeight: "700", fontSize: "14px" }}>{order.trackingNumber}</td>
                <td style={{ padding: "14px 18px", fontSize: "14px" }}>{order.sender?.name}</td>
                <td style={{ padding: "14px 18px", fontWeight: "700", color: "#27ae60" }}>₦{order.price || 2500}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ background: order.paymentStatus === "paid" ? "#eafaf1" : order.paymentStatus === "pending" ? "#fef9e7" : "#fdedec", color: order.paymentStatus === "paid" ? "#27ae60" : order.paymentStatus === "pending" ? "#f39c12" : "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ background: order.status === "delivered" ? "#eafaf1" : "#fef9e7", color: order.status === "delivered" ? "#27ae60" : "#f39c12", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "14px 18px", fontSize: "14px", color: "#7f8c8d" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <div style={{ padding: "50px", textAlign: "center", color: "#7f8c8d" }}>No payments found</div>}
      </div>
    </div>
  );
};

export default Payments;