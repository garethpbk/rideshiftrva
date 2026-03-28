import type { Metadata } from "next";
import { Card, CardContent } from "@heroui/react";

export const metadata: Metadata = {
  title: "Richmond Transit Resources",
};

const RESOURCES = [
  {
    category: "Public Transit",
    items: [
      {
        name: "GRTC Transit System",
        url: "https://www.ridegrtc.com",
        description:
          "Richmond's public transit provider — routes, schedules, and fare info for buses and the Pulse BRT.",
      },
      {
        name: "GRTC Maps & Schedules",
        url: "https://www.ridegrtc.com/maps-and-schedules/",
        description: "Route maps, timetables, and system overview.",
      },
      {
        name: "GRTC Real-Time Bus Tracker",
        url: "https://grtcbustracker.com/",
        description: "Live bus locations so you know exactly when yours arrives.",
      },
    ],
  },
  {
    category: "Biking",
    items: [
      {
        name: "RVA Bike Infrastructure Map",
        url: "https://richmond-geo-hub-cor.hub.arcgis.com/datasets/bicycle-infrastructure-completed/about",
        description:
          "City GIS map of completed bike lanes, shared-use paths, and bicycle infrastructure.",
      },
      {
        name: "Bike Walk RVA (Sports Backers)",
        url: "https://www.sportsbackers.org/program/bike-walk-rva/rva-bikeways-guide/",
        description:
          "Bikeways guide with recommended routes and trail connections across Richmond.",
      },
      {
        name: "Pedestrian, Bicycling & Trails",
        url: "https://www.rva.gov/public-works/pedestrian-bicycling-and-trails",
        description:
          "City of Richmond's official page for bike and pedestrian infrastructure projects.",
      },
    ],
  },
  {
    category: "Scooters",
    items: [
      {
        name: "Richmond E-Scooter Program",
        url: "https://www.rva.gov/public-works/e-scooter-program",
        description:
          "City info on e-scooter operators (Bird, Spin), equity zones with discounted rides, and rules of the road.",
      },
    ],
  },
  {
    category: "Carpooling & Rideshare",
    items: [
      {
        name: "RideFinders",
        url: "https://www.ridefinders.com/",
        description:
          "Free carpool and vanpool matching for Richmond-area commuters. A division of GRTC.",
      },
      {
        name: "ConnectingVA Rideshare",
        url: "https://connectingva.drpt.virginia.gov/rideshare/",
        description:
          "Virginia DRPT's statewide rideshare program — log commutes, find matches, earn rewards.",
      },
    ],
  },
  {
    category: "Walking & Safety",
    items: [
      {
        name: "Virginia PATHS",
        url: "https://virginiapaths.org/",
        description:
          "Pedestrian safety and active transportation advocacy across Virginia, including Richmond road safety assessments.",
      },
    ],
  },
];

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-3xl p-4 py-8">
      <h1 className="text-3xl font-bold">Richmond Transit Resources</h1>
      <p className="mt-2 text-zinc-600">
        Everything you need to get around Richmond without a car.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {RESOURCES.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-bold text-green-600">
              {section.category}
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {section.items.map((item) => (
                <Card key={item.url}>
                  <CardContent>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:decoration-green-600"
                    >
                      {item.name}
                    </a>
                    <p className="mt-1 text-sm text-zinc-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
