import React, { useState, useEffect } from "react";
import API from "../services/api";

const glassStyle = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => { fetchOrders(); fetchAgents(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchAgents = async () => {
    try {
      const res = await API.get("/agents");
      setAgents(res.data.agents);
    } catch (err) { console.error(err); }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status, note: `Status updated to ${status} by admin` });
      showMessage(`Order status updated to ${status.replace(/_/g, " ")}`, "success");
      fetchOrders();
    } catch (err) { showMessage("Error updating status", "error"); }
  };

  const assignAgent = async (orderId, agentId) => {
    if (!agentId) return;
    try {
      await API.patch(`/orders/${orderId}/assign`, { agentId });
      showMessage("Agent assigned successfully!", "success");
      fetchOrders();
    } catch (err) { showMessage("Error assigning agent", "error"); }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await API.patch(`/orders/${orderId}/cancel`, { reason: "Cancelled by admin" });
      showMessage("Order cancelled successfully", "success");
      fetchOrders();
    } catch (err) { showMessage(err.response?.data?.error || "Error cancelling order", "error"); }
  };

  const downloadInvoice = (orderId) => {
    window.open(`https://tobby-delivery-backend.onrender.com/api/invoices/${orderId}`, "_blank");
  };

  const getStatusColor = (status) => {
    const colors = { pending: "#f39c12", picked_up: "#3498db", in_transit: "#9b59b6", delivered: "#27ae60", cancelled: "#e74c3c", delayed: "#e67e22" };
    return colors[status] || "#95a5a6";
  };

  const getStatusIcon = (status) => {
    const icons = { pending: "⏳", picked_up: "📦", in_transit: "🚚", delivered: "✅", cancelled: "❌", delayed: "⚠️" };
    return icons[status] || "📦";
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

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        select option { background: #1a1a2e; color: white; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "900" }}>Orders Management</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "13px" }}>Manage and track all deliveries</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ background: "rgba(231,76,60,0.2)", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", padding: "8px 18px", borderRadius: "20px", fontWeight: "800", fontSize: "14px" }}>
            {filteredOrders.length} Orders
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div style={{ background: message.type === "error" ? "rgba(231,76,60,0.15)" : "rgba(39,174,96,0.15)", border: `1px solid ${message.type === "error" ? "rgba(231,76,60,0.4)" : "rgba(39,174,96,0.4)"}`, borderRadius: "14px", padding: "13px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", animation: "fadeUp 0.3s ease" }}>
          <span>{message.type === "error" ? "⚠️" : "✅"}</span>
          <span style={{ color: message.type === "error" ? "#e74c3c" : "#27ae60", fontWeight: "600", fontSize: "13px" }}>{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div style={{ ...glassStyle, padding: "16px 20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button key={status} onClick={() => setFilter(status)} style={{
              padding: "7px 14px", borderRadius: "20px", cursor: "pointer",
              background: filter === status ? "rgba(231,76,60,0.8)" : "rgba(255,255,255,0.06)",
              color: "white", border: filter === status ? "none" : "1px solid rgba(255,255,255,0.1)",
              fontWeight: filter === status ? "700" : "500", fontSize: "12px",
              display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap"
            }}>
              {getStatusIcon(status)} {status.replace(/_/g, " ").toUpperCase()}
              <span style={{ background: filter === status ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)", padding: "1px 7px", borderRadius: "10px", fontSize: "11px", fontWeight: "700" }}>
                {count}
              </span>
            </button>
          ))}
        </div>
        <div style={{ position: "relative", maxWidth: "420px", borderRadius: "12px", border: `1.5px solid ${searchFocused ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.05)", transition: "all 0.2s", boxShadow: searchFocused ? "0 0 0 3px rgba(231,76,60,0.1)" : "none" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
          <input type="text" placeholder="Search by tracking, name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ width: "100%", padding: "11px 12px 11px 36px", background: "transparent", border: "none", outline: "none", color: "white", fontSize: "13px", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ ...glassStyle, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Tracking #", "Sender", "Recipient", "Package", "Status", "Agent", "Payment", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(8).fill(0).map((_, j) => (
                    <td key={j} style={{ padding: "14px 16px" }}>
                      <div style={{ height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                {/* Tracking */}
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ fontWeight: "800", color: "#3498db", fontSize: "13px" }}>{order.trackingNumber}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</div>
                </td>

                {/* Sender */}
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "white" }}>{order.sender?.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{order.sender?.phone}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={order.sender?.address}>{order.sender?.address}</div>
                </td>

                {/* Recipient */}
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "white" }}>{order.recipient?.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{order.recipient?.phone}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={order.recipient?.address}>{order.recipient?.address}</div>
                </td>

                {/* Package */}
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{order.package?.description}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>⚖️ {order.package?.weight}kg</div>
                  {order.package?.fragile && <span style={{ background: "rgba(243,156,18,0.2)", color: "#f39c12", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "700", border: "1px solid rgba(243,156,18,0.3)" }}>⚠️ FRAGILE</span>}
                </td>

                {/* Status */}
                <td style={{ padding: "13px 16px" }}>
                  <select onChange={(e) => updateStatus(order._id, e.target.value)} value={order.status}
                    style={{ padding: "7px 10px", border: `1.5px solid ${getStatusColor(order.status)}50`, borderRadius: "10px", cursor: "pointer", color: getStatusColor(order.status), fontWeight: "700", fontSize: "11px", background: `${getStatusColor(order.status)}15`, outline: "none", maxWidth: "130px" }}>
                    <option value="pending">⏳ Pending</option>
                    <option value="picked_up">📦 Picked Up</option>
                    <option value="in_transit">🚚 In Transit</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="delayed">⚠️ Delayed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </td>

                {/* Agent */}
                <td style={{ padding: "13px 16px" }}>
                  {order.assignedAgent ? (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#27ae60", marginBottom: "4px" }}>✅ {order.assignedAgent.name}</div>
                      <select onChange={(e) => assignAgent(order._id, e.target.value)} value={order.assignedAgent?._id || ""}
                        style={{ padding: "5px 8px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", fontSize: "10px", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", outline: "none", maxWidth: "110px" }}>
                        <option value="">Reassign...</option>
                        {agents.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <select onChange={(e) => assignAgent(order._id, e.target.value)} value=""
                      style={{ padding: "7px 10px", border: "1.5px solid rgba(231,76,60,0.4)", borderRadius: "10px", cursor: "pointer", fontSize: "11px", color: "#e74c3c", fontWeight: "700", background: "rgba(231,76,60,0.1)", outline: "none", maxWidth: "130px" }}>
                      <option value="">⚡ Assign Agent</option>
                      {agents.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                    </select>
                  )}
                </td>

                {/* Payment */}
                <td style={{ padding: "13px 16px" }}>
                  <span style={{
                    background: order.paymentStatus === "paid" ? "rgba(39,174,96,0.2)" : order.paymentStatus === "pending" ? "rgba(243,156,18,0.2)" : "rgba(231,76,60,0.2)",
                    color: order.paymentStatus === "paid" ? "#27ae60" : order.paymentStatus === "pending" ? "#f39c12" : "#e74c3c",
                    padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                    border: `1px solid ${order.paymentStatus === "paid" ? "rgba(39,174,96,0.3)" : order.paymentStatus === "pending" ? "rgba(243,156,18,0.3)" : "rgba(231,76,60,0.3)"}`
                  }}>
                    {order.paymentStatus}
                  </span>
                  {order.price && <div style={{ fontSize: "11px", color: "#27ae60", fontWeight: "800", marginTop: "4px" }}>₦{order.price?.toLocaleString()}</div>}
                </td>

                {/* Actions */}
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <button onClick={() => setSelectedOrder(order)} style={{ padding: "6px 12px", background: "rgba(52,152,219,0.2)", color: "#3498db", border: "1px solid rgba(52,152,219,0.3)", borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      👁 Details
                    </button>
                    <button onClick={() => downloadInvoice(order._id)} style={{ padding: "6px 12px", background: "rgba(155,89,182,0.2)", color: "#9b59b6", border: "1px solid rgba(155,89,182,0.3)", borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      📄 Invoice
                    </button>
                    {order.status === "pending" && (
                      <button onClick={() => cancelOrder(order._id)} style={{ padding: "6px 12px", background: "rgba(231,76,60,0.15)", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap" }}>
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredOrders.length === 0 && (
          <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{
            background: "rgba(15,20,40,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "24px",
            padding: "30px",
            maxWidth: "620px",
            width: "100%",
            maxHeight: "85vh",
            overflowY: "auto",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            animation: "modalIn 0.3s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h3 style={{ color: "white", margin: "0 0 4px", fontWeight: "900", fontSize: "18px" }}>Order Details</h3>
                <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "12px" }}>Full information for this delivery</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "Tracking Number", value: selectedOrder.trackingNumber, color: "#3498db", icon: "📍" },
                { label: "Status", value: selectedOrder.status.replace(/_/g, " ").toUpperCase(), color: getStatusColor(selectedOrder.status), icon: getStatusIcon(selectedOrder.status) }
              ].map((item, i) => (
                <div key={i} style={{ background: `${item.color}10`, border: `1px solid ${item.color}25`, borderRadius: "14px", padding: "14px" }}>
                  <div style={{ fontSize: "10px", color: item.color, fontWeight: "700", marginBottom: "6px", letterSpacing: "0.5px" }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontWeight: "800", color: item.color, fontSize: "14px" }}>{item.icon} {item.value}</div>
                </div>
              ))}

              <div style={{ background: "rgba(52,152,219,0.1)", border: "1px solid rgba(52,152,219,0.2)", borderRadius: "14px", padding: "14px" }}>
                <div style={{ fontSize: "10px", color: "#3498db", fontWeight: "700", marginBottom: "8px" }}>📤 SENDER</div>
                <div style={{ fontWeight: "700", color: "white", fontSize: "14px" }}>{selectedOrder.sender?.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "3px" }}>📞 {selectedOrder.sender?.phone}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px", lineHeight: "1.4" }}>{selectedOrder.sender?.address}</div>
              </div>

              <div style={{ background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.2)", borderRadius: "14px", padding: "14px" }}>
                <div style={{ fontSize: "10px", color: "#27ae60", fontWeight: "700", marginBottom: "8px" }}>📥 RECIPIENT</div>
                <div style={{ fontWeight: "700", color: "white", fontSize: "14px" }}>{selectedOrder.recipient?.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "3px" }}>📞 {selectedOrder.recipient?.phone}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px", lineHeight: "1.4" }}>{selectedOrder.recipient?.address}</div>
              </div>

              <div style={{ background: "rgba(155,89,182,0.1)", border: "1px solid rgba(155,89,182,0.2)", borderRadius: "14px", padding: "14px" }}>
                <div style={{ fontSize: "10px", color: "#9b59b6", fontWeight: "700", marginBottom: "8px" }}>📦 PACKAGE</div>
                <div style={{ fontWeight: "700", color: "white", fontSize: "14px" }}>{selectedOrder.package?.description}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "3px" }}>⚖️ {selectedOrder.package?.weight}kg {selectedOrder.package?.fragile ? "• ⚠️ Fragile" : ""}</div>
              </div>

              <div style={{ background: "rgba(243,156,18,0.1)", border: "1px solid rgba(243,156,18,0.2)", borderRadius: "14px", padding: "14px" }}>
                <div style={{ fontSize: "10px", color: "#f39c12", fontWeight: "700", marginBottom: "8px" }}>💰 PAYMENT</div>
                <div style={{ fontWeight: "800", color: selectedOrder.paymentStatus === "paid" ? "#27ae60" : "#e74c3c", fontSize: "14px" }}>
                  {selectedOrder.paymentStatus?.toUpperCase()}
                </div>
                <div style={{ fontSize: "13px", color: "#27ae60", fontWeight: "800", marginTop: "3px" }}>₦{selectedOrder.price?.toLocaleString() || "N/A"}</div>
              </div>
            </div>

            {/* Status History */}
            {selectedOrder.statusHistory?.length > 0 && (
              <div style={{ marginTop: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "16px" }}>
                <h4 style={{ color: "white", marginBottom: "14px", fontWeight: "800", fontSize: "13px", letterSpacing: "0.5px" }}>📋 DELIVERY HISTORY</h4>
                {selectedOrder.statusHistory.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${getStatusColor(h.status)}20`, border: `1.5px solid ${getStatusColor(h.status)}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>
                      {getStatusIcon(h.status)}
                    </div>
                    <div>
                      <span style={{ fontWeight: "700", color: getStatusColor(h.status), fontSize: "12px" }}>{h.status.replace(/_/g, " ").toUpperCase()}</span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginLeft: "10px" }}>{new Date(h.timestamp).toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      {h.note && <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{h.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setSelectedOrder(null)}
              style={{ marginTop: "20px", width: "100%", padding: "13px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;