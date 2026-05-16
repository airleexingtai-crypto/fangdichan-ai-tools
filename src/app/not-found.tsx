export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>404</h1>
          <p>Page not found</p>
        </div>
      </body>
    </html>
  );
}
