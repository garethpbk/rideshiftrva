"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-green-600">
          RideShift RVA
        </Link>
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link href="/info">
            <Button className="bg-transparent text-zinc-600 hover:text-zinc-900" size="sm">
              Transit Resources
            </Button>
          </Link>
          <Link href="/plans">
            <Button className="bg-transparent text-zinc-600 hover:text-zinc-900" size="sm">
              Transit Plans
            </Button>
          </Link>
          <Link href="/goal">
            <Button className="bg-transparent text-zinc-600 hover:text-zinc-900" size="sm">
              My Goal
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-green-600 text-white font-semibold" size="sm">
              Dashboard
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
