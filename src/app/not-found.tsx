export const runtime = "edge";

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
          padding: "2rem",
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>404 — Page Not Found</h1>
          <p style={{ color: "var(--muted-foreground, #666)" }}>
            The page you are looking for does not exist.
          </p>
        </div>
      </body>
    </html>
  );
}
