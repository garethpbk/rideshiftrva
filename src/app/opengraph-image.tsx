import { ImageResponse } from "next/og";

export const alt = "Ride Shift RVA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>Ride Shift RVA</div>
        <div style={{ fontSize: 32, marginTop: 16, opacity: 0.9 }}>
          Move green, save green.
        </div>
        <div style={{ fontSize: 24, marginTop: 8, opacity: 0.7 }}>
          Earn local rewards for car-free commuting in Richmond, VA.
        </div>
      </div>
    ),
    { ...size },
  );
}
