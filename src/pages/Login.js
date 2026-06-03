import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      if (data.user.role !== "admin") {
        setError("Access denied. Admins only.");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.82)), url('https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "20px"
    }}>
      <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(231,76,60,0.12), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,152,219,0.1), transparent)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "20px", background: "linear-gradient(135deg, #e74c3c, #c0392b)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "32px", boxShadow: "0 8px 32px rgba(231,76,60,0.4)", transform: "perspective(500px) rotateX(5deg)" }}>🚚</div>
          <h1 style={{ color: "white", fontSize: "24px", fontWeight: "900", margin: "0 0 4px" }}>STeX Logistics</h1>
          <p style={{ color: "#e74c3c", margin: 0, fontSize: "11px", letterSpacing: "3px", fontWeight: "700" }}>ADMIN PORTAL</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: "24px", padding: "32px", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
          <h2 style={{ color: "white", fontSize: "20px", fontWeight: "800", margin: "0 0 6px" }}>Admin Sign In</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: "0 0 24px", fontSize: "13px" }}>Secure access to admin dashboard</p>

          {error && (
            <div style={{ background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.4)", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>⚠️</span>
              <span style={{ color: "#ff6b6b", fontSize: "13px", fontWeight: "500" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px" }}>EMAIL ADDRESS</label>
              <div style={{ position: "relative", borderRadius: "14px", border: `1.5px solid ${emailFocused ? "rgba(231,76,60,0.7)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.05)", transition: "all 0.2s", boxShadow: emailFocused ? "0 0 0 3px rgba(231,76,60,0.12)" : "none" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>📧</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} required
                  style={{ width: "100%", padding: "13px 14px 13px 42px", background: "transparent", border: "none", outline: "none", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px" }}>PASSWORD</label>
              <div style={{ position: "relative", borderRadius: "14px", border: `1.5px solid ${passwordFocused ? "rgba(231,76,60,0.7)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.05)", transition: "all 0.2s", boxShadow: passwordFocused ? "0 0 0 3px rgba(231,76,60,0.12)" : "none" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔒</span>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} required
                  style={{ width: "100%", padding: "13px 42px 13px 42px", background: "transparent", border: "none", outline: "none", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", padding: 0 }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "rgba(149,165,166,0.3)" : "linear-gradient(135deg, #e74c3c, #c0392b)", color: "white", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 8px 24px rgba(231,76,60,0.4)", letterSpacing: "0.3px" }}>
              {loading ? "Signing in..." : "Access Admin Dashboard →"}
            </button>
          </form>

          <div style={{ marginTop: "24px", padding: "14px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: 0 }}>🔒 Authorized administrators only. Unauthorized access is prohibited.</p>
          </div>
        </div>
      </div>

      <style>{`input::placeholder { color: rgba(255,255,255,0.2); } input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.05) inset !important; -webkit-text-fill-color: white !important; }`}</style>
    </div>
  );
};

export default Login;