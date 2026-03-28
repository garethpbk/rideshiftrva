import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "RideShift RVA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const urbanistBold = await readFile(
    join(process.cwd(), "assets/Urbanist-Bold.ttf"),
  );

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
          fontFamily: "Urbanist",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>RideShift RVA</div>
        <div style={{ fontSize: 32, marginTop: 16, opacity: 0.9 }}>
          Move green, save green.
        </div>
        <div style={{ fontSize: 24, marginTop: 8, opacity: 0.7 }}>
          Earn local rewards for car-free commuting in Richmond, VA.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Urbanist",
          data: urbanistBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
