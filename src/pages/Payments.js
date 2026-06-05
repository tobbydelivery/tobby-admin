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

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.paymentStatus === filter;
    const matchesSearch = order.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      order.sender?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + (o.price || 0), 0);
  const pendingRevenue = orders.filter(o => o.paymentStatus === "unpaid").reduce((sum, o) => sum + (o.price || 0), 0);
  const paidCount = orders.filter(o => o.paymentStatus === "paid").length;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "900" }}>Payments</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "13px" }}>Track all transactions and revenue</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, color: "#27ae60", icon: "💰", sub: `${paidCount} paid orders` },
          { label: "Pending Revenue", value: `₦${pendingRevenue.toLocaleString()}`, color: "#e74c3c", icon: "⏳", sub: `${orders.filter(o => o.paymentStatus === "unpaid").length} unpaid orders` },
          { label: "Total Transactions", value: orders.length, color: "#3498db", icon: "📊", sub: "All time" }
        ].map((stat, i) => (
          <div key={i} style={{ ...glassStyle, padding: "22px", borderTop: `2px solid ${stat.color}40`, animation: `fadeUp ${0.2 + i * 0.1}s ease` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "0 0 8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</p>
                <div style={{ fontSize: "26px", fontWeight: "900", color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>{stat.sub}</div>
              </div>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: `${stat.color}15`, border: `1px solid ${stat.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...glassStyle, padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px", borderRadius: "12px", border: `1.5px solid ${searchFocused ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
          <input type="text" placeholder="Search by tracking or name..." value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{ width: "100%", padding: "10px 12px 10px 36px", background: "transparent", border: "none", outline: "none", color: "white", fontSize: "13px", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "paid", "unpaid", "pending"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 16px", background: filter === s ? "rgba(231,76,60,0.8)" : "rgba(255,255,255,0.06)", color: "white", border: filter === s ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: filter === s ? "700" : "500" }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ ...glassStyle, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "white", margin: 0, fontSize: "15px", fontWeight: "800" }}>All Transactions</h3>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>{filteredOrders.length} results</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Tracking #", "Customer", "Amount", "Payment", "Order Status", "Date"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(6).fill(0).map((_, j) => (
                    <td key={j} style={{ padding: "14px 20px" }}>
                      <div style={{ height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 20px", color: "#3498db", fontWeight: "800", fontSize: "13px" }}>{order.trackingNumber}</td>
                <td style={{ padding: "13px 20px", fontSize: "13px", color: "white", fontWeight: "600" }}>{order.sender?.name}</td>
                <td style={{ padding: "13px 20px", fontWeight: "800", color: "#27ae60", fontSize: "14px" }}>₦{(order.price || 2500).toLocaleString()}</td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{
                    background: order.paymentStatus === "paid" ? "rgba(39,174,96,0.2)" : order.paymentStatus === "pending" ? "rgba(243,156,18,0.2)" : "rgba(231,76,60,0.2)",
                    color: order.paymentStatus === "paid" ? "#27ae60" : order.paymentStatus === "pending" ? "#f39c12" : "#e74c3c",
                    padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                    border: `1px solid ${order.paymentStatus === "paid" ? "rgba(39,174,96,0.3)" : order.paymentStatus === "pending" ? "rgba(243,156,18,0.3)" : "rgba(231,76,60,0.3)"}`
                  }}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ background: order.status === "delivered" ? "rgba(39,174,96,0.15)" : "rgba(243,156,18,0.15)", color: order.status === "delivered" ? "#27ae60" : "#f39c12", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
                    {order.status?.replace(/_/g, " ")}
                  </span>
                </td>
                <td style={{ padding: "13px 20px", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredOrders.length === 0 && (
          <div style={{ padding: "50px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>💰</div>
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;