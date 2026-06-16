import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png')`,
          backgroundSize: "cover", backgroundPosition: "center",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Segoe UI', sans-serif", textAlign: "center", padding: "20px"
        }}>
          <div>
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>⚠️</div>
            <h1 style={{ color: "white", fontSize: "28px", fontWeight: "900", marginBottom: "12px" }}>
              Something Went Wrong
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "30px", fontSize: "16px" }}>
              We're sorry for the inconvenience. Please refresh the page.
            </p>
            <button onClick={() => window.location.reload()} style={{
              padding: "14px 30px", background: "#e74c3c", color: "white",
              border: "none", borderRadius: "30px", fontSize: "16px",
              fontWeight: "700", cursor: "pointer", marginRight: "12px"
            }}>
              🔄 Refresh Page
            </button>
            <button onClick={() => window.location.href = "/"} style={{
              padding: "14px 30px", background: "transparent", color: "white",
              border: "2px solid white", borderRadius: "30px", fontSize: "16px",
              fontWeight: "700", cursor: "pointer"
            }}>
              🏠 Go Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;