import { notFound } from 'next/navigation';
import { packages } from '../../../utils/investment';
"use client";


/*
 * PackageDetailPage displays details for a single investment package.
 * It reads the dynamic route param `id` to select the package from
 * the packages array.  If the index is out of bounds, it returns 404.
 */
interface Props {
  params: { id: string };
}

export default function PackageDetailPage({ params }: Props) {
  const index = parseInt(params.id, 10);
  const pkg = packages[index];
  if (!pkg) {
    return notFound();
  }
  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">{pkg.name} Package</h1>
          <p className="section-sub">More about this investment strategy.</p>
        </div>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="package-name" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{pkg.name}</h2>
          <p className="package-desc" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>{pkg.description}</p>
          <p className="package-meta" style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            <strong>Expected return:</strong> {(pkg.expectedReturn * 100).toFixed(1)}%<br />
            <strong>Risk level:</strong> {pkg.risk}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>
            This portfolio invests your contributions across various asset classes.  The mix
            depends on the risk level, balancing long‑term growth against volatility.  For
            conservative investors the allocation emphasises bonds and income.  For
            growth‑oriented investors it leans toward equities and alternatives.  Adjust
            your monthly contribution and time horizon on the projection page to see the
            potential outcomes.
          </p>
        </div>
      </section>
    </main>
  );
}