import { useState, useEffect, useRef } from 'react';
import { packages, runProjection } from '../../utils/investment';

/*
 * ProjectionPage provides a full‑screen version of the projection tool.
 * Users can adjust starting balance, monthly contribution, time horizon,
 * inflation and select an investment package.  The projection is
 * recalculated on every change and displayed as a line chart.
 */
export default function ProjectionPage() {
  const [startingBalance, setStartingBalance] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(20);
  const [inflation, setInflation] = useState(2);
  const [pkgIndex, setPkgIndex] = useState(1);
  const [projection, setProjection] = useState(() => runProjection(startingBalance, monthlyContribution, years, inflation, pkgIndex));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Recalculate whenever inputs change
  useEffect(() => {
    const result = runProjection(startingBalance, monthlyContribution, years, inflation, pkgIndex);
    setProjection(result);
  }, [startingBalance, monthlyContribution, years, inflation, pkgIndex]);

  // Draw line chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { labels, values } = projection;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const paddingX = 40;
    const paddingY = 25;
    // axes
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingX, 10);
    ctx.lineTo(paddingX, height - paddingY);
    ctx.lineTo(width - 10, height - paddingY);
    ctx.stroke();
    // line
    ctx.beginPath();
    values.forEach((val, i) => {
      const x = paddingX + (width - paddingX - 20) * (i / (values.length - 1));
      const y = height - paddingY - (height - paddingY * 2) * ((val - min) / (max - min || 1));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#22C55E');
    gradient.addColorStop(1, '#16A34A');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [projection]);

  function formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Investment Projection</h1>
          <p className="section-sub">Explore how your money grows under different scenarios.</p>
        </div>
        <div className="card">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="startingBalance">Starting balance ($)</label>
              <input
                id="startingBalance"
                type="number"
                min="0"
                value={startingBalance}
                onChange={(e) => setStartingBalance(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="monthlyContribution">Monthly contribution ($)</label>
              <input
                id="monthlyContribution"
                type="number"
                min="0"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="years">Years</label>
              <input
                id="years"
                type="number"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="inflation">Inflation (%)</label>
              <input
                id="inflation"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={inflation}
                onChange={(e) => setInflation(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="packageSelect">Package</label>
              <select
                id="packageSelect"
                value={pkgIndex}
                onChange={(e) => setPkgIndex(parseInt(e.target.value) || 0)}
                style={{ padding: '0.55rem 0.6rem', borderRadius: '10px', border: '1px solid #CBD5E1' }}
              >
                {packages.map((pkg, idx) => (
                  <option key={pkg.name} value={idx}>
                    {pkg.name} ({(pkg.expectedReturn * 100).toFixed(1)}%)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <canvas ref={canvasRef} width={800} height={280}></canvas>
          </div>
          <div className="stat-grid" style={{ marginTop: '1rem' }}>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Total contributions</div>
              <div className="stat-value">{formatCurrency(projection.totalContributions)}</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Future value</div>
              <div className="stat-value">{formatCurrency(projection.futureValue)}</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Real value (inflation-adjusted)</div>
              <div className="stat-value">{formatCurrency(projection.realValue)}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}