import { ImageResponse } from "next/og";

export const alt = "Nexo — Spanish that finally connects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f5f6f8",
          color: "#161915",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 78px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", fontSize: 31, fontWeight: 700, gap: 18 }}>
          <div style={{ alignItems: "center", background: "#20221f", borderRadius: 14, color: "white", display: "flex", height: 54, justifyContent: "center", width: 54 }}>N</div>
          Nexo
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <div style={{ color: "#214bd6", fontSize: 23, fontWeight: 700, letterSpacing: 1.6, marginBottom: 22, textTransform: "uppercase" }}>A complete Spanish course</div>
          <div style={{ fontSize: 82, fontWeight: 650, letterSpacing: -5.5, lineHeight: 0.98 }}>Spanish that finally connects.</div>
          <div style={{ color: "#5c6270", fontSize: 28, marginTop: 30 }}>Written-first · Free · Open source</div>
        </div>
      </div>
    ),
    size,
  );
}
