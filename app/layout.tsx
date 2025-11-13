"use client";

import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-left">
            <div className="logo-mark"></div>
            <div className="logo-text">WealthPilot</div>
          </div>

          <div className="nav-links">
            <Link href="/">Overview</Link>
            <Link href="/projection">Projection</Link>
            <Link href="/income">Plan</Link>
            <Link href="/packages">Packages</Link>
            <Link href="/planner">AI Planner</Link>
          </div>

          <div className="nav-cta">
            <div className="nav-pill">Rich mode: ON</div>
            <button
              className="nav-button"
              type="button"
              onClick={() => console.log("Dashboard clicked")}
            >
              Open Dashboard
            </button>
          </div>
        </nav>

        {children}

        <footer>
          © {year} WealthPilot. Built to make your future feel inevitable.
        </footer>
      </body>
    </html>
  );
}
