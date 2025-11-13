"use client";
import { useState, useEffect } from 'react';
import { packages, estimateNetWorth } from '../../utils/investment';


/*
 * IncomePage implements the income & budget planner as a standalone page.
 * It calculates the recommended invest amount based on disposable income,
 * suggests a package and estimates net worth after 20 years using that
 * package.  Values update as the user edits the inputs.
 */
export default function IncomePage() {
  const [income, setIncome] = useState(5000);
  const [savings, setSavings] = useState(1000);
  const [spending, setSpending] = useState(3500);
  const [recommended, setRecommended] = useState(0);
  const [pkgIndex, setPkgIndex] = useState(1);
  const [estimated, setEstimated] = useState(0);

  // Compute recommendations whenever inputs change
  useEffect(() => {
    const disposable = income - spending;
    let invest = Math.max(0, disposable * 0.4);
    invest = Math.min(invest, savings);
    setRecommended(invest);
    const ratio = income ? invest / income : 0;
    let index = 0;
    if (ratio < 0.1) index = 0;
    else if (ratio < 0.2) index = 1;
    else if (ratio < 0.3) index = 2;
    else index = 3;
    setPkgIndex(index);
    setEstimated(estimateNetWorth(invest, index, 20));
  }, [income, savings, spending]);

  function formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Income & Budget Planner</h1>
          <p className="section-sub">Make sure your lifestyle and investing habits are working together.</p>
        </div>
        <div className="card">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="income">Monthly income ($)</label>
              <input
                id="income"
                type="number"
                min="0"
                value={income}
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="savings">Monthly savings ($)</label>
              <input
                id="savings"
                type="number"
                min="0"
                value={savings}
                onChange={(e) => setSavings(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="spending">Monthly spending ($)</label>
              <input
                id="spending"
                type="number"
                min="0"
                value={spending}
                onChange={(e) => setSpending(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="stat-grid" style={{ marginTop: '0.8rem' }}>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Recommended invest</div>
              <div className="stat-value">{formatCurrency(recommended)}</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Suggested package</div>
              <div className="stat-value">{packages[pkgIndex].name}</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Estimated net worth (20 years)</div>
              <div className="stat-value">{formatCurrency(estimated)}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}