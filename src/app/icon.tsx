import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const urbanistBold = await readFile(
    join(process.cwd(), "assets/Urbanist-Black.ttf")
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
          background: "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 20,
            borderRadius: 3,
            background: "#16a34a",
            color: "white",
            paddingLeft: 2,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontFamily: "Urbanist",
              fontWeight: 900,
              letterSpacing: -0.5,
            }}
          >
            RS
          </span>
          <span
            style={{
              fontSize: 16,
              fontFamily: "Urbanist",
              fontWeight: 900,
              marginLeft: 1,
              marginTop: -2,
            }}
          >
            ›
          </span>
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
          weight: 900,
        },
      ],
    }
  );
}
