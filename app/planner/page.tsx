/*
 * PlannerPage displays the AI financial planner UI.  It currently acts
 * as a placeholder — the backend integration is left for a future
 * iteration.  Users can describe a financial goal but no
 * action happens yet.
 */
export default function PlannerPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">AI Financial Planner</h1>
          <p className="section-sub">Describe your financial ambition and we’ll map out the steps.</p>
        </div>
        <div className="card planner-box">
          <label htmlFor="goal" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '0.4rem' }}>
            What’s your main financial goal right now?
          </label>
          <textarea
            id="goal"
            placeholder="E.g. Buy a $700k home in 6 years, or hit $250k invested by age 30."
            style={{ width: '100%', minHeight: '110px', borderRadius: '12px', border: '1px solid #CBD5E1', padding: '0.8rem 0.9rem', fontSize: '0.9rem', resize: 'vertical', outline: 'none' }}
          />
          <button className="planner-btn" type="button" disabled>
            AI planning coming soon
          </button>
          <div className="planner-output">
            WealthPilot will turn your goal into a concrete roadmap with milestones,
            contribution targets and risk ranges — once the AI backend is wired in.
          </div>
        </div>
      </section>
    </main>
  );
}