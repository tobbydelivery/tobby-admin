import React, { useState, useEffect } from "react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

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

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status, note: `Status updated to ${status} by admin` });
      showMessage(`✅ Order status updated to ${status.replace(/_/g, " ")}`);
      fetchOrders();
    } catch (err) {
      showMessage("❌ Error updating status", "error");
    }
  };

  const assignAgent = async (orderId, agentId) => {
    if (!agentId) return;
    try {
      await API.patch(`/orders/${orderId}/assign`, { agentId });
      showMessage("✅ Agent assigned successfully!");
      fetchOrders();
    } catch (err) {
      showMessage("❌ Error assigning agent", "error");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await API.patch(`/orders/${orderId}/cancel`, { reason: "Cancelled by admin" });
      showMessage("✅ Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      showMessage(err.response?.data?.error || "❌ Error cancelling order", "error");
    }
  };

  const downloadInvoice = (orderId) => {
    window.open(`https://tobby-delivery-backend.onrender.com/api/invoices/${orderId}`, "_blank");
  };

  const getStatusColor = (status) => {
    const colors = { pending: "#f39c12", picked_up: "#3498db", in_transit: "#9b59b6", delivered: "#27ae60", cancelled: "#e74c3c", delayed: "#e67e22" };
    return colors[status] || "#95a5a6";
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      order.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.recipient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.sender?.phone?.includes(search) ||
      order.recipient?.phone?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    picked_up: orders.filter(o => o.status === "picked_up").length,
    in_transit: orders.filter(o => o.status === "in_transit").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    delayed: orders.filter(o => o.status === "delayed").length,
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "15px" }}>⏳</div>
        <p style={{ color: "#7f8c8d" }}>Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div>
          <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px", fontWeight: "800" }}>Orders Management</h2>
          <p style={{ color: "#7f8c8d", marginTop: "5px" }}>Manage all delivery orders</p>
        </div>
        <div style={{ background: "#e74c3c", color: "white", padding: "10px 20px", borderRadius: "10px", fontWeight: "700" }}>
          {filteredOrders.length} Orders
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{ background: messageType === "error" ? "#fdedec" : "#eafaf1", color: messageType === "error" ? "#e74c3c" : "#27ae60", padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", borderLeft: `4px solid ${messageType === "error" ? "#e74c3c" : "#27ae60"}`, fontWeight: "600" }}>
          {message}
        </div>
      )}

      {/* Status Filter Tabs */}
      <div style={{ background: "white", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button key={status} onClick={() => setFilter(status)} style={{
              padding: "8px 16px", background: filter === status ? "#e74c3c" : "#f8f9fa",
              color: filter === status ? "white" : "#2c3e50", border: "none",
              borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px",
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              {status.replace(/_/g, " ").toUpperCase()}
              <span style={{ background: filter === status ? "rgba(255,255,255,0.3)" : "#e0e0e0", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by tracking number, name, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "12px 16px", border: "2px solid #ecf0f1", borderRadius: "10px", fontSize: "14px", width: "400px", outline: "none" }}
        />
      </div>

      {/* Orders Table */}
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Tracking #", "Sender", "Recipient", "Package", "Status", "Agent", "Payment", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#2c3e50", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                {/* Tracking */}
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: "800", color: "#3498db", fontSize: "13px" }}>{order.trackingNumber}</div>
                  <div style={{ fontSize: "11px", color: "#95a5a6", marginTop: "2px" }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </td>

                {/* Sender */}
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>{order.sender?.name}</div>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>{order.sender?.phone}</div>
                  <div style={{ fontSize: "11px", color: "#95a5a6" }} title={order.sender?.address}>{order.sender?.address?.substring(0, 25)}...</div>
                </td>

                {/* Recipient */}
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>{order.recipient?.name}</div>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>{order.recipient?.phone}</div>
                  <div style={{ fontSize: "11px", color: "#95a5a6" }} title={order.recipient?.address}>{order.recipient?.address?.substring(0, 25)}...</div>
                </td>

                {/* Package */}
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: "12px", color: "#555" }}>{order.package?.description}</div>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>{order.package?.weight}kg</div>
                  {order.package?.fragile && <span style={{ background: "#fef9e7", color: "#f39c12", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "700" }}>⚠️ FRAGILE</span>}
                </td>

                {/* Status */}
                <td style={{ padding: "14px 16px" }}>
                  <select onChange={(e) => updateStatus(order._id, e.target.value)} value={order.status}
                    style={{ padding: "8px 10px", border: `2px solid ${getStatusColor(order.status)}`, borderRadius: "8px", cursor: "pointer", color: getStatusColor(order.status), fontWeight: "700", fontSize: "12px", background: "white" }}>
                    <option value="pending">⏳ Pending</option>
                    <option value="picked_up">📦 Picked Up</option>
                    <option value="in_transit">🚚 In Transit</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="delayed">⚠️ Delayed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </td>

                {/* Agent */}
                <td style={{ padding: "14px 16px" }}>
                  {order.assignedAgent ? (
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#27ae60" }}>✅ {order.assignedAgent.name}</div>
                      <select onChange={(e) => assignAgent(order._id, e.target.value)} value={order.assignedAgent?._id || ""}
                        style={{ padding: "6px 8px", border: "1px solid #ecf0f1", borderRadius: "6px", cursor: "pointer", fontSize: "11px", marginTop: "4px" }}>
                        <option value="">Reassign...</option>
                        {agents.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <select onChange={(e) => assignAgent(order._id, e.target.value)} value=""
                      style={{ padding: "8px 10px", border: "2px solid #ecf0f1", borderRadius: "8px", cursor: "pointer", fontSize: "12px", color: "#e74c3c", fontWeight: "600" }}>
                      <option value="">⚡ Assign Agent</option>
                      {agents.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                    </select>
                  )}
                </td>

                {/* Payment */}
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ background: order.paymentStatus === "paid" ? "#eafaf1" : order.paymentStatus === "pending" ? "#fef9e7" : "#fdedec", color: order.paymentStatus === "paid" ? "#27ae60" : order.paymentStatus === "pending" ? "#f39c12" : "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
                    {order.paymentStatus}
                  </span>
                  {order.price && <div style={{ fontSize: "11px", color: "#27ae60", fontWeight: "700", marginTop: "4px" }}>₦{order.price?.toLocaleString()}</div>}
                </td>

                {/* Actions */}
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button onClick={() => downloadInvoice(order._id)} style={{ padding: "6px 12px", background: "#9b59b6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>
                      📄 Invoice
                    </button>
                    <button onClick={() => setSelectedOrder(order)} style={{ padding: "6px 12px", background: "#3498db", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>
                      👁 Details
                    </button>
                    {order.status === "pending" && (
                      <button onClick={() => cancelOrder(order._id)} style={{ padding: "6px 12px", background: "#fdedec", color: "#e74c3c", border: "1px solid #e74c3c", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div style={{ padding: "60px", textAlign: "center", color: "#7f8c8d" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "30px", maxWidth: "600px", width: "90%", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: "#2c3e50", margin: 0, fontWeight: "800" }}>Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#7f8c8d" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#e74c3c", fontWeight: "700", marginBottom: "8px" }}>TRACKING NUMBER</div>
                <div style={{ fontWeight: "800", color: "#3498db" }}>{selectedOrder.trackingNumber}</div>
              </div>
              <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#e74c3c", fontWeight: "700", marginBottom: "8px" }}>STATUS</div>
                <span style={{ background: getStatusColor(selectedOrder.status), color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                  {selectedOrder.status.replace(/_/g, " ")}
                </span>
              </div>
              <div style={{ background: "#ebf5fb", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#3498db", fontWeight: "700", marginBottom: "8px" }}>📤 SENDER</div>
                <div style={{ fontWeight: "600" }}>{selectedOrder.sender?.name}</div>
                <div style={{ fontSize: "13px", color: "#7f8c8d" }}>{selectedOrder.sender?.phone}</div>
                <div style={{ fontSize: "12px", color: "#95a5a6", marginTop: "4px" }}>{selectedOrder.sender?.address}</div>
              </div>
              <div style={{ background: "#eafaf1", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#27ae60", fontWeight: "700", marginBottom: "8px" }}>📥 RECIPIENT</div>
                <div style={{ fontWeight: "600" }}>{selectedOrder.recipient?.name}</div>
                <div style={{ fontSize: "13px", color: "#7f8c8d" }}>{selectedOrder.recipient?.phone}</div>
                <div style={{ fontSize: "12px", color: "#95a5a6", marginTop: "4px" }}>{selectedOrder.recipient?.address}</div>
              </div>
              <div style={{ background: "#f3e9fd", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#9b59b6", fontWeight: "700", marginBottom: "8px" }}>📦 PACKAGE</div>
                <div style={{ fontWeight: "600" }}>{selectedOrder.package?.description}</div>
                <div style={{ fontSize: "13px", color: "#7f8c8d" }}>{selectedOrder.package?.weight}kg {selectedOrder.package?.fragile ? "⚠️ Fragile" : ""}</div>
              </div>
              <div style={{ background: "#fef9e7", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#f39c12", fontWeight: "700", marginBottom: "8px" }}>💰 PAYMENT</div>
                <div style={{ fontWeight: "600", color: selectedOrder.paymentStatus === "paid" ? "#27ae60" : "#e74c3c" }}>
                  {selectedOrder.paymentStatus?.toUpperCase()}
                </div>
                <div style={{ fontSize: "13px", color: "#7f8c8d" }}>₦{selectedOrder.price?.toLocaleString()}</div>
              </div>
            </div>

            {/* Status History */}
            {selectedOrder.statusHistory?.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4 style={{ color: "#2c3e50", marginBottom: "12px", fontWeight: "700" }}>📋 Status History</h4>
                {selectedOrder.statusHistory.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: getStatusColor(h.status), marginTop: "4px", flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: "700", color: getStatusColor(h.status), fontSize: "13px" }}>{h.status.replace(/_/g, " ").toUpperCase()}</span>
                      <span style={{ color: "#95a5a6", fontSize: "12px", marginLeft: "10px" }}>{new Date(h.timestamp).toLocaleString()}</span>
                      {h.note && <div style={{ fontSize: "12px", color: "#7f8c8d", marginTop: "2px" }}>{h.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setSelectedOrder(null)} style={{ marginTop: "20px", width: "100%", padding: "12px", background: "#2c3e50", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;