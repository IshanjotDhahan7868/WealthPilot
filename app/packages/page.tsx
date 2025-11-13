import Link from 'next/link';
import { packages } from '../../utils/investment';
"use client";


/*
 * PackagesPage displays all investment packages available in WealthPilot.
 * Users can click on a package card to view more details.
 */
export default function PackagesPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Investment packages</h2>
          <p className="section-sub">Choose the portfolio that matches your risk appetite and timeline.</p>
        </div>
        <div className="package-grid">
          {packages.map((pkg, idx) => (
            <Link key={pkg.name} href={`/packages/${idx}`} className="package-card" style={{ textDecoration: 'none' }}>
              <div className="package-name">{pkg.name}</div>
              <div className="package-desc">{pkg.description}</div>
              <div className="package-meta">
                <strong>Expected return:</strong> {(pkg.expectedReturn * 100).toFixed(1)}% ·{' '}
                <strong>Risk:</strong> {pkg.risk}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}