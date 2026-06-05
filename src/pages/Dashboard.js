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

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [focused, setFocused] = useState({});
  const [form, setForm] = useState({
    code: "", description: "", discountType: "percentage",
    discountValue: "", minOrderAmount: "", maxUses: "100", expiresAt: ""
  });

  useEffect(() => { fetchDiscounts(); }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await API.get("/discounts");
      setDiscounts(res.data.discounts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const createDiscount = async (e) => {
    e.preventDefault();
    try {
      await API.post("/discounts/create", form);
      setMessage({ text: "Discount code created successfully!", type: "success" });
      setShowForm(false);
      setForm({ code: "", description: "", discountType: "percentage", discountValue: "", minOrderAmount: "", maxUses: "100", expiresAt: "" });
      fetchDiscounts();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || "Error creating discount", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const deleteDiscount = async (id) => {
    if (window.confirm("Delete this discount code?")) {
      await API.delete(`/discounts/${id}`);
      fetchDiscounts();
    }
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "transparent", border: "none", outline: "none", color: "white", fontSize: "14px", boxSizing: "border-box" };
  const fieldWrap = (key) => ({ borderRadius: "12px", border: `1.5px solid ${focused[key] ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.05)", transition: "all 0.2s", boxShadow: focused[key] ? "0 0 0 3px rgba(231,76,60,0.1)" : "none" });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "900" }}>Discount Codes</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "13px" }}>Manage promo and discount codes</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "11px 22px", background: showForm ? "rgba(231,76,60,0.2)" : "linear-gradient(135deg, #e74c3c, #c0392b)", color: showForm ? "#e74c3c" : "white", border: showForm ? "1px solid rgba(231,76,60,0.4)" : "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: showForm ? "none" : "0 6px 20px rgba(231,76,60,0.35)" }}>
          {showForm ? "✕ Cancel" : "+ Create Code"}
        </button>
      </div>

      {message.text && (
        <div style={{ background: message.type === "success" ? "rgba(39,174,96,0.15)" : "rgba(231,76,60,0.15)", border: `1px solid ${message.type === "success" ? "rgba(39,174,96,0.4)" : "rgba(231,76,60,0.4)"}`, borderRadius: "14px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{message.type === "success" ? "✅" : "⚠️"}</span>
          <span style={{ color: message.type === "success" ? "#27ae60" : "#e74c3c", fontWeight: "600", fontSize: "14px" }}>{message.text}</span>
        </div>
      )}

      {showForm && (
        <div style={{ ...glassStyle, padding: "28px", marginBottom: "24px" }}>
          <h3 style={{ color: "white", margin: "0 0 20px", fontWeight: "800", fontSize: "16px" }}>Create Discount Code</h3>
          <form onSubmit={createDiscount}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Code", key: "code", type: "text", hint: "e.g. SAVE20" },
                { label: "Description", key: "description", type: "text", hint: "e.g. 20% off first order" },
                { label: "Discount Value", key: "discountValue", type: "number", hint: "Enter amount" },
                { label: "Min Order Amount (₦)", key: "minOrderAmount", type: "number", hint: "Minimum order" },
                { label: "Max Uses", key: "maxUses", type: "number", hint: "Maximum redemptions" },
                { label: "Expires At", key: "expiresAt", type: "date", hint: "" }
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", marginBottom: "7px", color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>{field.label.toUpperCase()}</label>
                  <div style={fieldWrap(field.key)}>
                    <input type={field.type} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: field.key === "code" ? e.target.value.toUpperCase() : e.target.value })}
                      onFocus={() => setFocused({ ...focused, [field.key]: true })} onBlur={() => setFocused({ ...focused, [field.key]: false })}
                      style={inputStyle} />
                  </div>
                  {field.hint && <p style={{ margin: "4px 0 0 2px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{field.hint}</p>}
                </div>
              ))}
              <div>
                <label style={{ display: "block", marginBottom: "7px", color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>DISCOUNT TYPE</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[{ value: "percentage", label: "% Percentage" }, { value: "fixed", label: "₦ Fixed Amount" }].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setForm({ ...form, discountType: opt.value })}
                      style={{ flex: 1, padding: "12px", borderRadius: "12px", cursor: "pointer", border: `1.5px solid ${form.discountType === opt.value ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`, background: form.discountType === opt.value ? "rgba(231,76,60,0.15)" : "rgba(255,255,255,0.04)", color: form.discountType === opt.value ? "#e74c3c" : "rgba(255,255,255,0.6)", fontWeight: "600", fontSize: "13px" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button type="submit" style={{ padding: "12px 28px", background: "linear-gradient(135deg, #e74c3c, #c0392b)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 6px 20px rgba(231,76,60,0.35)" }}>Create Code →</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ ...glassStyle, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "white", margin: 0, fontSize: "15px", fontWeight: "800" }}>Active Codes</h3>
          <span style={{ background: "rgba(231,76,60,0.2)", color: "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid rgba(231,76,60,0.3)" }}>{discounts.length} Total</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Code", "Description", "Type", "Value", "Used", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array(3).fill(0).map((_, i) => (
              <tr key={i}>
                {Array(7).fill(0).map((_, j) => (
                  <td key={j} style={{ padding: "14px 20px" }}>
                    <div style={{ height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
                  </td>
                ))}
              </tr>
            )) : discounts.map((d, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ fontWeight: "900", color: "#e74c3c", fontSize: "15px", letterSpacing: "1px", background: "rgba(231,76,60,0.1)", padding: "4px 10px", borderRadius: "8px" }}>{d.code}</span>
                </td>
                <td style={{ padding: "13px 20px", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{d.description || "—"}</td>
                <td style={{ padding: "13px 20px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{d.discountType}</td>
                <td style={{ padding: "13px 20px", fontWeight: "800", color: "#27ae60", fontSize: "14px" }}>{d.discountType === "percentage" ? `${d.discountValue}%` : `₦${d.discountValue}`}</td>
                <td style={{ padding: "13px 20px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{d.usedCount}/{d.maxUses}</td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ background: d.isActive ? "rgba(39,174,96,0.2)" : "rgba(231,76,60,0.2)", color: d.isActive ? "#27ae60" : "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: `1px solid ${d.isActive ? "rgba(39,174,96,0.3)" : "rgba(231,76,60,0.3)"}` }}>
                    {d.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "13px 20px" }}>
                  <button onClick={() => deleteDiscount(d._id)} style={{ padding: "6px 14px", background: "rgba(231,76,60,0.15)", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && discounts.length === 0 && (
          <div style={{ padding: "50px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🏷️</div>
            <p>No discount codes yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discounts;