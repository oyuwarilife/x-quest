import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const level = searchParams.get("level") || "1";
  const title = searchParams.get("title") || "見習い冒険者";
  const titleColor = searchParams.get("color") || "#95A5A6";
  const completed = searchParams.get("completed") || "0";
  const total = searchParams.get("total") || "37";
  const streak = searchParams.get("streak") || "0";
  const name = searchParams.get("name") || "冒険者";

  const completedNum = parseInt(completed, 10);
  const totalNum = parseInt(total, 10);
  const progress = totalNum > 0 ? completedNum / totalNum : 0;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "sans-serif",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 装飾背景 */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,92,231,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,184,148,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 36 }}>&#x2694;&#xFE0F;</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{ fontSize: 28, fontWeight: 900, color: "#1DA1F2" }}
              >
                X
              </span>
              <span
                style={{ fontSize: 28, fontWeight: 900, color: "#6C5CE7" }}
              >
                Quest
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#aaa",
              fontSize: 16,
            }}
          >
            <span>{name}</span>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 16,
          }}
        >
          {/* レベル */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: titleColor,
              display: "flex",
            }}
          >
            Lv.{level}
          </div>

          {/* 称号 */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: titleColor,
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* 進捗バー */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "80%",
              marginTop: 24,
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: 16,
                borderRadius: 8,
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  height: "100%",
                  borderRadius: 8,
                  background: `linear-gradient(90deg, #6C5CE7, #00B894)`,
                  display: "flex",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                color: "#aaa",
                fontSize: 16,
              }}
            >
              <span style={{ display: "flex" }}>
                {completed}/{total} クエスト達成
              </span>
              <span style={{ display: "flex" }}>
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* フッター統計 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 28, display: "flex" }}>&#x1F525;</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#E17055",
                display: "flex",
              }}
            >
              {streak}日連続
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 28, display: "flex" }}>&#x2694;&#xFE0F;</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#FDCB6E",
                display: "flex",
              }}
            >
              {completed}クエスト
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
