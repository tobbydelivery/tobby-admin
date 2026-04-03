import React, { useState, useEffect } from "react";
import API from "../services/api";

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.paymentStatus === filter;
  });

  const totalRevenue = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.price || 0), 0);

  const pendingRevenue = orders
    .filter(o => o.paymentStatus === "unpaid")
    .reduce((sum, o) => sum + (o.price || 0), 0);

  if (loading) return <p style={{ padding: "20px" }}>Loading payments...</p>;

  return (
    <div>
      <h2 style={{ color: "#2c3e50", marginBottom: "25px" }}>💰 Payments</h2>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #27ae60"
        }}>
          <div style={{ fontSize: "14px", color: "#7f8c8d" }}>Total Revenue</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#27ae60" }}>₦{totalRevenue.toLocaleString()}</div>
        </div>
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #e74c3c"
        }}>
          <div style={{ fontSize: "14px", color: "#7f8c8d" }}>Pending Revenue</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#e74c3c" }}>₦{pendingRevenue.toLocaleString()}</div>
        </div>
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #3498db"
        }}>
          <div style={{ fontSize: "14px", color: "#7f8c8d" }}>Total Transactions</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#3498db" }}>{orders.length}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["all", "paid", "unpaid", "pending"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "10px 20px",
              background: filter === s ? "#3498db" : "white",
              color: filter === s ? "white" : "#2c3e50",
              border: "2px solid #ecf0f1",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "white" }}>
              <th style={{ padding: "15px", textAlign: "left" }}>Tracking #</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Payment Status</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Order Status</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ecf0f1", background: i % 2 === 0 ? "white" : "#f8f9fa" }}>
                <td style={{ padding: "12px", color: "#3498db", fontWeight: "bold" }}>{order.trackingNumber}</td>
                <td style={{ padding: "12px" }}>{order.sender?.name}</td>
                <td style={{ padding: "12px", fontWeight: "bold" }}>₦{order.price || 2500}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: order.paymentStatus === "paid" ? "#27ae60" : order.paymentStatus === "pending" ? "#f39c12" : "#e74c3c",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: order.status === "delivered" ? "#27ae60" : "#f39c12",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#7f8c8d" }}>
            No payments found
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;