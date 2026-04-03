import React, { useState, useEffect } from "react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchAgents();
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

  const fetchAgents = async () => {
    try {
      const res = await API.get("/agents");
      setAgents(res.data.agents);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status, note: `Status updated to ${status}` });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const assignAgent = async (orderId, agentId) => {
    try {
      await API.patch(`/orders/${orderId}/assign`, { agentId });
      fetchOrders();
      alert("Agent assigned successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const downloadInvoice = (orderId) => {
    const token = localStorage.getItem("token");
    window.open(`http://localhost:3000/api/invoices/${orderId}?token=${token}`, "_blank");
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = order.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      order.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.recipient?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <p style={{ padding: "20px" }}>Loading orders...</p>;

  return (
    <div>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📦 Orders Management</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by tracking number or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 15px",
            border: "2px solid #ecf0f1",
            borderRadius: "6px",
            fontSize: "14px",
            width: "300px"
          }}
        />
        {["all", "pending", "picked_up", "in_transit", "delivered", "cancelled"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "10px 15px",
              background: filter === s ? "#3498db" : "white",
              color: filter === s ? "white" : "#2c3e50",
              border: "2px solid #ecf0f1",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {s.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "white" }}>
              <th style={{ padding: "15px", textAlign: "left" }}>Tracking #</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Sender</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Recipient</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Agent</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Payment</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ecf0f1", background: i % 2 === 0 ? "white" : "#f8f9fa" }}>
                <td style={{ padding: "12px", color: "#3498db", fontWeight: "bold" }}>{order.trackingNumber}</td>
                <td style={{ padding: "12px" }}>
                  <div>{order.sender?.name}</div>
                  <div style={{ fontSize: "12px", color: "#7f8c8d" }}>{order.sender?.phone}</div>
                </td>
                <td style={{ padding: "12px" }}>
                  <div>{order.recipient?.name}</div>
                  <div style={{ fontSize: "12px", color: "#7f8c8d" }}>{order.recipient?.phone}</div>
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    value={order.status}
                    style={{
                      padding: "6px",
                      border: `2px solid ${getStatusColor(order.status)}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: getStatusColor(order.status),
                      fontWeight: "bold"
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    onChange={(e) => assignAgent(order._id, e.target.value)}
                    value={order.assignedAgent?._id || ""}
                    style={{
                      padding: "6px",
                      border: "1px solid #ecf0f1",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">Assign Agent</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: order.paymentStatus === "paid" ? "#27ae60" : "#e74c3c",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => downloadInvoice(order._id)}
                    style={{
                      padding: "6px 12px",
                      background: "#9b59b6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    📄 Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#7f8c8d" }}>
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;