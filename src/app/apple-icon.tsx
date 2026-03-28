import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const urbanistBold = await readFile(
    join(process.cwd(), "assets/Urbanist-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: 36,
          background: "#16a34a",
          color: "white",
        }}
      >
        <span
          style={{
            fontSize: 62,
            fontFamily: "Urbanist",
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          RVA
        </span>
        <span
          style={{
            fontSize: 78,
            fontFamily: "Urbanist",
            fontWeight: 700,
            marginLeft: -4,
            marginTop: -4,
          }}
        >
          ›
        </span>
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
