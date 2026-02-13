import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "X Quest - X運用マスターへの冒険";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #F8F9FE 0%, #E8E5FF 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 8, display: "flex" }}>
          &#x2694;&#xFE0F;
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 900, color: "#1DA1F2" }}>
            X
          </span>
          <span style={{ fontSize: 72, fontWeight: 900, color: "#6C5CE7" }}>
            Quest
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#2D3436",
            marginBottom: 16,
          }}
        >
          X運用マスターへの冒険
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#636E72",
            textAlign: "center",
          }}
        >
          6つのステージをクリアして案件獲得レベルまでランクアップしよう
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
          }}
        >
          {["🎯", "📝", "🔥", "🤝", "🔗", "🏆"].map((emoji, i) => (
            <div
              key={i}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
