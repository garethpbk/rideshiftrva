import type { Metadata } from "next";
import { Card, CardContent, Button } from "@heroui/react";

export const metadata: Metadata = {
  title: "Richmond Transportation Plans",
};

const PLANS = [
  {
    name: "Richmond Connects Project Tracker",
    url: "https://experience.arcgis.com/experience/120779108e77426c84cd61ec48477ae4",
    description:
      "Interactive map tracking Richmond's active transportation infrastructure projects.",
    preview: "/images/richmond-connects-tracker.png",
  },
  {
    name: "Vision Zero Plan: Safer Roads for All Modes",
    url: "https://www.rva.gov/sites/default/files/2021-05/VisionZero-RichmondActionPlan.pdf",
    description:
      "The City of Richmond's action plan to eliminate traffic fatalities and serious injuries.",
  },
  {
    name: "Bicycle Master Plan",
    url: "https://www.rva.gov/sites/default/files/2019-10/Richmond%20Bicycle%20Master%20Plan%203.6.15_lr.pdf",
    description:
      "Richmond's comprehensive plan for expanding and improving bicycle infrastructure citywide.",
  },
];

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 py-8">
      <h1 className="text-3xl font-bold">Richmond Transportation Plans</h1>
      <p className="mt-2 text-zinc-600">
        Richmond is shifting transportation with the following efforts:
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {PLANS.map((plan) => (
          <div key={plan.url}>
            <Card>
              <CardContent>
                <a
                  href={plan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:decoration-green-600"
                >
                  {plan.name}
                </a>
                <p className="mt-1 text-sm text-zinc-600">{plan.description}</p>
              </CardContent>
            </Card>
            {"preview" in plan && plan.preview && (
              <a
                href={plan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block overflow-hidden rounded-lg border border-zinc-200 transition-shadow hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={plan.preview}
                  alt={`Preview of ${plan.name}`}
                  className="w-full"
                />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-green-50 p-6">
        <h2 className="text-xl font-bold text-green-800">
          Got an idea to make it better?
        </h2>
        <p className="mt-2 text-green-700">
          Submit a comment to the Richmond Connects team:
        </p>
        <div className="mt-4">
          <a
            href="https://survey123.arcgis.com/share/71acb994607d49b7b3a4104e5f9a7637"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-600 text-white font-semibold">
              Share Your Feedback
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
