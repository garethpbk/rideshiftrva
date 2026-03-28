import { Card, CardContent, Button } from "@heroui/react";
import Link from "next/link";

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Move Green.{" "}
          <span className="text-green-600">Save Green.</span>
        </h1>
        <p className="max-w-xl text-xl text-zinc-600">
          Mix your commute. Unlock local deals.
        </p>
        <p className="max-w-2xl text-lg text-zinc-500">
          RideShift RVA connects Richmonders with weekly discounts from local
          businesses — just for choosing the bus, a bike, or your own two feet.
        </p>
        <div className="mt-4 flex gap-4">
          <Link href="/auth/signin">
            <Button className="bg-green-600 text-white font-semibold text-lg px-8 py-3">
              Get Started
            </Button>
          </Link>
          <Link href="/info">
            <Button className="bg-zinc-100 text-zinc-700 font-semibold text-lg px-8 py-3">
              Transit Resources
            </Button>
          </Link>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">The Problem</h2>
          <p className="mt-4 text-lg text-zinc-600">
            Too many Richmond commutes start and end in a single car. Traffic
            builds. Emissions rise. And our roads — already under constant
            construction — take the hit.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-4 text-center">
            <div>
              <p className="text-3xl font-bold text-red-600">~75%</p>
              <p className="text-sm text-zinc-500">Drive alone</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600">~9%</p>
              <p className="text-sm text-zinc-500">Carpool</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">~1.5%</p>
              <p className="text-sm text-zinc-500">Public transit</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">~3%</p>
              <p className="text-sm text-zinc-500">Walk / bike / scooter</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">The Solution</h2>
          <p className="mt-4 text-lg text-zinc-600">
            RideShift makes multimodal transit worth it. Set a weekly goal,
            confirm you met it, and redeem real deals at local businesses
            enrolled in the program — lower emissions and real savings at
            participating spots. Simple.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-green-600">1</p>
                <h3 className="mt-2 text-lg font-semibold">Move</h3>
                <p className="text-sm text-zinc-500">
                  Take the bus, bike, scooter, walk, or combine modes — then set your
                  weekly goal in the app
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-green-600">2</p>
                <h3 className="mt-2 text-lg font-semibold">Confirm</h3>
                <p className="text-sm text-zinc-500">
                  Get a Sunday check-in email and confirm you met your goal
                  with one click
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-green-600">3</p>
                <h3 className="mt-2 text-lg font-semibold">Save</h3>
                <p className="text-sm text-zinc-500">
                  Unlock weekly deals at participating Richmond businesses
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Every Richmonder / For Local Businesses */}
      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold">For Every Richmonder</h3>
              <p className="mt-2 text-zinc-600">
                RideShift is built for all of Richmond — every neighborhood,
                every zip code. Sign up with just your email and start earning
                rewards for the way you already get around.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold">For Local Businesses</h3>
              <p className="mt-2 text-zinc-600">
                Turn Richmond commuters into your regulars. List a weekly deal,
                attract foot traffic, and show your community you&apos;re invested
                in a cleaner, smarter city.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Participating Businesses */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Participating Businesses</h2>
          <p className="mt-2 text-zinc-500">
            Local businesses already on board
          </p>
          <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-lg font-semibold">Rushing Blooms</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Moulton Hot Natives</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function HomePage() {
  return <LandingPage />;
}
