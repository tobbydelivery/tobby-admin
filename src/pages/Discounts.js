import React, { useState, useEffect } from "react";
import API from "../services/api";

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
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
      setMessage("Discount code created successfully!");
      setShowForm(false);
      setForm({ code: "", description: "", discountType: "percentage", discountValue: "", minOrderAmount: "", maxUses: "100", expiresAt: "" });
      fetchDiscounts();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating discount");
    }
  };

  const deleteDiscount = async (id) => {
    if (window.confirm("Delete this discount code?")) {
      await API.delete(`/discounts/${id}`);
      fetchDiscounts();
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div>
          <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "24px", fontWeight: "800" }}>Discount Codes</h2>
          <p style={{ color: "#7f8c8d", marginTop: "5px" }}>Manage promo and discount codes</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "12px 24px", background: "#e74c3c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>
          + Create Code
        </button>
      </div>

      {message && <div style={{ background: message.includes("success") ? "#eafaf1" : "#fdedec", color: message.includes("success") ? "#27ae60" : "#e74c3c", padding: "14px", borderRadius: "10px", marginBottom: "20px" }}>{message}</div>}

      {showForm && (
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", marginBottom: "25px" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "700" }}>Create Discount Code</h3>
          <form onSubmit={createDiscount}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              {[
                { label: "Code", key: "code", type: "text", placeholder: "SAVE20" },
                { label: "Description", key: "description", type: "text", placeholder: "20% off first order" },
                { label: "Discount Value", key: "discountValue", type: "number", placeholder: "20" },
                { label: "Min Order Amount (₦)", key: "minOrderAmount", type: "number", placeholder: "1000" },
                { label: "Max Uses", key: "maxUses", type: "number", placeholder: "100" },
                { label: "Expires At", key: "expiresAt", type: "date", placeholder: "" }
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", marginBottom: "6px", color: "#2c3e50", fontWeight: "600", fontSize: "13px" }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder} style={{ width: "100%", padding: "10px 14px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#2c3e50", fontWeight: "600", fontSize: "13px" }}>Discount Type</label>
                <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "14px" }}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <button type="submit" style={{ padding: "12px 28px", background: "#e74c3c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>Create</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "12px 28px", background: "#ecf0f1", color: "#2c3e50", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Code", "Description", "Type", "Value", "Used", "Max Uses", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", color: "#2c3e50", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {discounts.map((d, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "14px 18px", fontWeight: "800", color: "#e74c3c", fontSize: "16px", letterSpacing: "1px" }}>{d.code}</td>
                <td style={{ padding: "14px 18px", fontSize: "13px", color: "#555" }}>{d.description || "—"}</td>
                <td style={{ padding: "14px 18px", fontSize: "13px" }}>{d.discountType}</td>
                <td style={{ padding: "14px 18px", fontWeight: "700", color: "#27ae60" }}>{d.discountType === "percentage" ? `${d.discountValue}%` : `₦${d.discountValue}`}</td>
                <td style={{ padding: "14px 18px", fontSize: "13px" }}>{d.usedCount}</td>
                <td style={{ padding: "14px 18px", fontSize: "13px" }}>{d.maxUses}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ background: d.isActive ? "#eafaf1" : "#fdedec", color: d.isActive ? "#27ae60" : "#e74c3c", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {d.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <button onClick={() => deleteDiscount(d._id)} style={{ padding: "6px 14px", background: "#fdedec", color: "#e74c3c", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {discounts.length === 0 && <div style={{ padding: "50px", textAlign: "center", color: "#7f8c8d" }}>No discount codes yet</div>}
      </div>
    </div>
  );
};

export default Discounts;