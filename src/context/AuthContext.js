import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from "react";
import API from "../services/api";

const AuthContext = createContext();

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Warn 5 minutes before timeout

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      startSessionTimer();
    }
    setLoading(false);
  }, []);

  // Track user activity
  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];

    const resetTimer = () => {
      if (user) {
        setSessionWarning(false);
        startSessionTimer();
      }
    };

    events.forEach(event => window.addEventListener(event, resetTimer));
    return () => events.forEach(event => window.removeEventListener(event, resetTimer));
  }, [user]);

  const startSessionTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setSessionWarning(true);
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout();
      alert("Your session has expired. Please login again.");
    }, SESSION_TIMEOUT);
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("loginTime", new Date().toISOString());
    setUser(res.data.user);
    startSessionTimer();
    return res.data;
  };

  const logout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setUser(null);
    setSessionWarning(false);
  }, []);

  const extendSession = () => {
    setSessionWarning(false);
    startSessionTimer();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, sessionWarning, extendSession }}>
      {/* Session Warning Banner */}
      {sessionWarning && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "#f39c12", color: "white", padding: "12px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>
            ⚠️ Your session will expire in 5 minutes due to inactivity.
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={extendSession} style={{
              padding: "8px 16px", background: "white", color: "#f39c12",
              border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700"
            }}>
              Stay Logged In
            </button>
            <button onClick={logout} style={{
              padding: "8px 16px", background: "rgba(0,0,0,0.2)", color: "white",
              border: "1px solid white", borderRadius: "6px", cursor: "pointer", fontWeight: "600"
            }}>
              Logout Now
            </button>
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);