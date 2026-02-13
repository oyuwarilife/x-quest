import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
          borderRadius: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 160 }}>&#x2694;&#xFE0F;</span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "white",
              marginTop: -20,
              letterSpacing: -4,
            }}
          >
            XQ
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
