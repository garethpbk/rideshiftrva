import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RideShift RVA",
    short_name: "RideShift",
    description:
      "Move green, save green. Earn local rewards for car-free commuting in Richmond, VA.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
  };
}
