/*
 * Home page for WealthPilot.
 *
 * This page is largely based on the rich V3.5 HTML prototype provided by the user.
 * It reuses the same class names and markup to achieve the identical look and
 * feel. JavaScript logic from the prototype has been migrated into React
 * through useEffect hooks. Market data, score, goals and insights are
 * simulated client-side for demonstration. In a real application these
 * would be fetched from Supabase or other APIs. For brevity, event
 * handlers and helper functions are defined within the component.
 */

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Helper functions for formatting
    function formatCurrency(value: number): string {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    }
    // Hero metrics setup
    function initHero() {
      // Example static values; replace with data from Supabase in production
      const netWorth = 482000;
      const savingsRate = 0.23;
      const change = 0.04;
      const netWorthEl = document.getElementById('hero-net-worth');
      const savingsRateEl = document.getElementById('hero-savings-rate');
      const changePill = document.getElementById('hero-change-pill');
      const suggestionEl = document.getElementById('hero-suggestion');
      if (netWorthEl) netWorthEl.textContent = formatCurrency(netWorth);
      if (savingsRateEl) savingsRateEl.textContent = `${(savingsRate * 100).toFixed(0)}%`;
      if (changePill) {
        const sign = change >= 0 ? '+' : '';
        changePill.textContent = `↑ ${sign}${(change * 100).toFixed(1)}% vs last month`;
      }
      const suggestions = [
        'You’re on track to cross $1M before age 45. Adding +$100/month shaves ~1.8 years off that date.',
        'Your savings rate is already strong. The next level is automating an extra 2–3% salary into investments.',
        'At your current pace, your portfolio could replace ~40% of your income by age 50. A small boost now compounds massively.',
        'Your projected future is already impressive. The real edge is staying consistent during boring markets.'
      ];
      const picked = suggestions[Math.floor(Math.random() * suggestions.length)];
      if (suggestionEl) suggestionEl.textContent = picked;
    }
    // Market overview simulation
    function initMarket() {
      const items = [
        { label: 'S&P 500', value: '5,320', change: +0.8 },
        { label: 'NASDAQ', value: '18,120', change: +1.2 },
        { label: 'BTC', value: '$96,200', change: -0.9 },
        { label: 'CAD / USD', value: '0.73', change: +0.1 },
        { label: 'CPI (YoY)', value: '2.4%', change: -0.2 }
      ];
      const container = document.getElementById('market-overview');
      if (!container) return;
      container.innerHTML = '';
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'market-item';
        const label = document.createElement('div');
        label.className = 'market-label';
        label.textContent = item.label;
        const value = document.createElement('div');
        value.className = 'market-value';
        value.textContent = item.value;
        const change = document.createElement('div');
        change.className = 'market-change ' + (item.change >= 0 ? 'positive' : 'negative');
        change.textContent = (item.change >= 0 ? '↑ ' : '↓ ') + Math.abs(item.change).toFixed(1) + '%';
        div.appendChild(label);
        div.appendChild(value);
        div.appendChild(change);
        container.appendChild(div);
      });
    }
    // Financial score
    function initScore() {
      const score = 86;
      const label = score >= 85 ? 'Strong and disciplined.' : score >= 70 ? 'Solid foundation — a few tweaks away from elite.' : 'Plenty of upside. Small changes will show quickly.';
      const scoreNum = document.getElementById('score-number');
      const scoreLabel = document.getElementById('score-label');
      const bar = document.getElementById('score-bar');
      if (scoreNum) scoreNum.textContent = String(score);
      if (scoreLabel) scoreLabel.textContent = label;
      if (bar) requestAnimationFrame(() => { (bar as HTMLElement).style.width = score + '%'; });
    }
    // Sparkline drawing
    function drawSparkline(ctx: CanvasRenderingContext2D, data: number[]) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      ctx.clearRect(0, 0, width, height);
      const min = Math.min(...data);
      const max = Math.max(...data);
      const paddingX = 12;
      const paddingY = 10;
      // baseline
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(paddingX, height - paddingY);
      ctx.lineTo(width - paddingX, height - paddingY);
      ctx.stroke();
      ctx.beginPath();
      data.forEach((val, i) => {
        const x = paddingX + (width - paddingX * 2) * (i / (data.length - 1));
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
    }
    function initSparkline() {
      const canvas = document.getElementById('sparkline') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const base = 95;
      const data: number[] = [];
      for (let i = 0; i < 12; i++) {
        const val = base + i * 2 + (Math.random() * 4 - 2);
        data.push(val * 1000);
      }
      drawSparkline(ctx, data);
    }
    // Portfolio pie
    function drawPortfolioPie() {
      const canvas = document.getElementById('portfolio-pie') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const data = [0.6, 0.25, 0.1, 0.05];
      const colors = ['#22C55E', '#86EFAC', '#BBF7D0', '#DCFCE7'];
      const total = data.reduce((a, b) => a + b, 0);
      let start = -Math.PI / 2;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 4;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      data.forEach((value, i) => {
        const angle = (value / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, start + angle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        start += angle;
      });
      // center circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.fillStyle = '#16A34A';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('60% Eq.', cx, cy);
    }
    // Goals setup
    function initGoals() {
      const goals = [
        { name: 'Emergency fund', progress: 0.72 },
        { name: 'Home down payment', progress: 0.18 },
        { name: 'Freedom fund', progress: 0.09 }
      ];
      const container = document.getElementById('goals-list');
      if (!container) return;
      container.innerHTML = '';
      goals.forEach(goal => {
        const wrap = document.createElement('div');
        wrap.className = 'goal-item';
        const top = document.createElement('div');
        top.className = 'goal-top';
        const name = document.createElement('div');
        name.className = 'goal-name';
        name.textContent = goal.name;
        const percent = document.createElement('div');
        percent.className = 'goal-percent';
        percent.textContent = Math.round(goal.progress * 100) + '%';
        top.appendChild(name);
        top.appendChild(percent);
        const barOuter = document.createElement('div');
        barOuter.className = 'goal-bar';
        const barInner = document.createElement('div');
        barInner.className = 'goal-fill';
        barInner.style.width = (goal.progress * 100) + '%';
        barOuter.appendChild(barInner);
        wrap.appendChild(top);
        wrap.appendChild(barOuter);
        container.appendChild(wrap);
      });
    }
    // Insights
    function initInsights() {
      const insights = [
        { type: 'positive', title: 'You saved more than last month.', body: 'Your effective savings rate is ~23%. Even a +2% bump now compounds into six figures over 15–20 years.' },
        { type: 'neutral', title: 'You’re under-invested in equities.', body: 'At your time horizon, bumping equities from 60% to ~70% could materially raise your expected future value.' },
        { type: 'positive', title: 'You’re ahead of your emergency fund target.', body: 'You’re past the 6-month buffer. You can safely channel more into higher-growth assets.' },
        { type: 'neutral', title: 'Your lifestyle is stable.', body: 'Spending hasn’t spiked in 3 months. This consistency is a huge hidden advantage.' }
      ];
      const container = document.getElementById('insights');
      if (!container) return;
      container.innerHTML = '';
      insights.forEach(ins => {
        const row = document.createElement('div');
        row.className = 'insight-item';
        const icon = document.createElement('div');
        icon.className = 'insight-icon ' + (ins.type === 'positive' ? 'positive' : ins.type === 'negative' ? 'negative' : 'neutral');
        const content = document.createElement('div');
        const title = document.createElement('div');
        title.className = 'insight-title';
        title.textContent = ins.title;
        const body = document.createElement('div');
        body.className = 'insight-body';
        body.textContent = ins.body;
        content.appendChild(title);
        content.appendChild(body);
        row.appendChild(icon);
        row.appendChild(content);
        container.appendChild(row);
      });
    }
    // Action messages
    function showActionMessage(type: string) {
      const el = document.getElementById('action-message');
      if (!el) return;
      if (type === 'connect') {
        el.textContent = 'In a live version, this would walk you through linking another account or income source for richer modelling.';
      } else if (type === 'goal') {
        el.textContent = 'We’d open a guided flow to define a goal, attach numbers to it and show its impact on your timeline.';
      } else if (type === 'boost') {
        el.textContent = 'We’d simulate +$100–$300/month more and visually compare your original vs boosted trajectories.';
      }
    }
    // Scroll helper
    function scrollToSection(id: string) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Expose handlers on window for inline onclick usage
    (window as any).scrollToSection = scrollToSection;
    (window as any).showActionMessage = showActionMessage;
    // Initialise everything
    initHero();
    initMarket();
    initScore();
    initSparkline();
    drawPortfolioPie();
    initGoals();
    initInsights();
  }, []);

  return (
    <main className="page">
      {/* HERO SECTION */}
      <section className="hero">
        <div>
          <div className="hero-pills">
            <div className="hero-pill">Personal wealth OS</div>
            <div className="hero-pill">Projection • Budget • AI insights</div>
          </div>
          <h1 className="hero-left-title">
            Grow your wealth with <span className="hero-highlight">calm, rich confidence.</span>
          </h1>
          <p className="hero-left-sub">
            WealthPilot shows exactly what your future looks like if you keep investing the way you do today — and how small changes can accelerate your net worth.
          </p>
          <div className="hero-cta-row">
            <button className="hero-primary" type="button" onClick={() => (window as any).scrollToSection('projection')}>
              Run my first projection →
            </button>
            <button className="hero-secondary" type="button" onClick={() => (window as any).scrollToSection('projection')}>
              View full dashboard
            </button>
          </div>
          <div className="hero-badge-row">
            <span className="hero-badge-dot"></span>
            <span>Private beta · Built for serious investors</span>
            <span>·</span>
            <span>Feels like your own family office.</span>
          </div>
        </div>
        <div className="hero-right-card float-soft">
          <div className="hero-orb"></div>
          <div className="hero-orb-ring"></div>
          <div className="hero-metrics">
            <div className="metric-card">
              <div className="metric-label">Net worth projection (age 40)</div>
              <div className="metric-primary" id="hero-net-worth">$0</div>
              <div className="metric-sub">If you keep investing exactly as you are today.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">This month’s savings rate</div>
              <div className="metric-primary" id="hero-savings-rate">0%</div>
              <div className="metric-pill positive" id="hero-change-pill"></div>
            </div>
          </div>
          <div className="hero-suggestion" id="hero-suggestion">Loading personalised suggestion…</div>
        </div>
      </section>
      {/* MARKET & SCORE */}
      <section className="section" id="overview">
        <div className="grid-2">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Market snapshot</h2>
              <p className="section-sub">A quick read on the world you’re investing in.</p>
            </div>
            <div className="market-row" id="market-overview"></div>
          </div>
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Your financial score</h2>
              <p className="section-sub">A simple score from 0–100 based on your current inputs.</p>
            </div>
            <div className="score-number" id="score-number">0</div>
            <div className="score-label" id="score-label">Calculating...</div>
            <div className="score-bar-wrap">
              <div className="score-bar-fill" id="score-bar"></div>
            </div>
            <div className="score-tags">
              <span className="tag-pill">Savings habits</span>
              <span className="tag-pill">Spending discipline</span>
              <span className="tag-pill">Time in market</span>
            </div>
          </div>
        </div>
      </section>
      {/* SPARKLINE */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Net worth trend (last 12 months)</h2>
          <p className="section-sub">A smooth, simple view of how your wealth is moving.</p>
        </div>
        <div className="card">
          <div className="sparkline-wrap">
            <canvas id="sparkline" width={800} height={130}></canvas>
          </div>
        </div>
      </section>
      {/* PORTFOLIO & GOALS */}
      <section className="section">
        <div className="grid-2">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Portfolio summary</h2>
              <p className="section-sub">High-level view of where your money actually lives.</p>
            </div>
            <div className="portfolio-big" id="portfolio-total">$120,000</div>
            <div className="portfolio-sub">Across accounts you’ve modelled in WealthPilot.</div>
            <div className="pill-inline green">
              <span>↑ +$0 this year</span>
              <span>Simulated performance</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.1rem', alignItems: 'center' }}>
              <canvas id="portfolio-pie" width={150} height={150}></canvas>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)' }}>
                <div>60% Global equities</div>
                <div>25% Bonds &amp; fixed income</div>
                <div>10% Cash &amp; equivalents</div>
                <div>5% Alternatives</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Goals, at a glance</h2>
              <p className="section-sub">Every goal is a mini future you’re already funding.</p>
            </div>
            <div id="goals-list"></div>
          </div>
        </div>
      </section>
      {/* INSIGHTS & ACTIONS */}
      <section className="section">
        <div className="grid-2">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Smart insights</h2>
              <p className="section-sub">Tiny nudges that compound into big outcomes.</p>
            </div>
            <div id="insights"></div>
          </div>
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">One-tap actions</h2>
              <p className="section-sub">Turn ideas into actual changes in your plan.</p>
            </div>
            <div className="action-row">
              <button className="action-button" type="button" onClick={() => (window as any).showActionMessage('connect')}>
                <div>
                  <div className="action-label">Connect a new account</div>
                  <div className="action-sub">Model another income or investing stream.</div>
                </div>
                <div className="action-icon"></div>
              </button>
              <button className="action-button" type="button" onClick={() => (window as any).showActionMessage('goal')}>
                <div>
                  <div className="action-label">Start a new goal</div>
                  <div className="action-sub">House, car, freedom number — all welcome.</div>
                </div>
                <div className="action-icon"></div>
              </button>
              <button className="action-button" type="button" onClick={() => (window as any).showActionMessage('boost')}>
                <div>
                  <div className="action-label">Boost monthly investing</div>
                  <div className="action-sub">See how +$100/month compounds over time.</div>
                </div>
                <div className="action-icon"></div>
              </button>
            </div>
            <p id="action-message" style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-soft)' }}></p>
          </div>
        </div>
      </section>
      {/* QUICK TOOLS */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Quick tools</h2>
          <p className="section-sub">Jump straight into the calculators that matter right now.</p>
        </div>
        <div className="quick-grid">
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => (window as any).scrollToSection('projection')}>
            <div className="quick-card-title">Projection studio</div>
            <div className="quick-card-sub">Play with contributions, time and risk to see your future.</div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => (window as any).scrollToSection('income')}>
            <div className="quick-card-title">Income &amp; budget planner</div>
            <div className="quick-card-sub">Sanity-check your monthly flow before it leaks.</div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => (window as any).scrollToSection('packages')}>
            <div className="quick-card-title">Investment packages</div>
            <div className="quick-card-sub">From conservative to aggressive, pre-built allocations.</div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => (window as any).scrollToSection('planner')}>
            <div className="quick-card-title">AI wealth prompts</div>
            <div className="quick-card-sub">Tell WealthPilot what you’re aiming at and refine over time.</div>
          </div>
        </div>
      </section>
      {/* PACKAGES */}
      <section className="section" id="packages">
        <div className="section-header">
          <h2 className="section-title">Investment packages</h2>
          <p className="section-sub">We reuse the same logic as SmartInvestorPackages with cleaner UX.</p>
        </div>
        <div className="package-grid" id="package-grid-home"></div>
      </section>
      {/* PROJECTION TOOL */}
      <section className="section" id="projection">
        <div className="section-header">
          <h2 className="section-title">Projection tool</h2>
          <p className="section-sub">Simulate how contributions and time create future wealth.</p>
        </div>
        <div className="card">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="starting-balance">Starting balance ($)</label>
              <input id="starting-balance" type="number" defaultValue="10000" min="0" />
            </div>
            <div className="form-field">
              <label htmlFor="monthly-contribution">Monthly contribution ($)</label>
              <input id="monthly-contribution" type="number" defaultValue="500" min="0" />
            </div>
            <div className="form-field">
              <label htmlFor="years">Years</label>
              <input id="years" type="number" defaultValue="20" min="1" max="50" />
            </div>
            <div className="form-field">
              <label htmlFor="inflation">Inflation (%)</label>
              <input id="inflation" type="number" defaultValue="2" min="0" max="10" step="0.1" />
            </div>
          </div>
          <div style={{ height: '260px' }}>
            <canvas id="projection-chart" width={800} height={240}></canvas>
          </div>
          <div className="stat-grid" style={{ marginTop: '1.1rem' }}>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Total contributions</div>
              <div className="stat-value" id="contributionsValue">$0</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Future value</div>
              <div className="stat-value" id="futureValue">$0</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Real value (inflation-adjusted)</div>
              <div className="stat-value" id="realValue">$0</div>
            </div>
          </div>
        </div>
      </section>
      {/* INCOME & BUDGET */}
      <section className="section" id="income">
        <div className="section-header">
          <h2 className="section-title">Income &amp; budget planner</h2>
          <p className="section-sub">Make sure your lifestyle matches your long-term goals.</p>
        </div>
        <div className="card">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="income-input">Monthly income ($)</label>
              <input id="income-input" type="number" defaultValue="5000" min="0" />
            </div>
            <div className="form-field">
              <label htmlFor="savings-input">Monthly savings ($)</label>
              <input id="savings-input" type="number" defaultValue="1000" min="0" />
            </div>
            <div className="form-field">
              <label htmlFor="spending-input">Monthly spending ($)</label>
              <input id="spending-input" type="number" defaultValue="3500" min="0" />
            </div>
          </div>
          <div className="stat-grid" style={{ marginTop: '0.8rem' }}>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Recommended invest</div>
              <div className="stat-value" id="recommendedInvest">$0</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Suggested package</div>
              <div className="stat-value" id="suggestedPackage">–</div>
            </div>
            <div className="card" style={{ boxShadow: 'none', borderColor: '#E5E7EB' }}>
              <div className="stat-label">Estimated net worth (20 years)</div>
              <div className="stat-value" id="estimatedNetWorth">$0</div>
            </div>
          </div>
        </div>
      </section>
      {/* AI PLANNER */}
      <section className="section" id="planner">
        <div className="section-header">
          <h2 className="section-title">AI financial planner</h2>
          <p className="section-sub">
            The UI is ready — later, this will talk to a real AI and your real data.
          </p>
        </div>
        <div className="card planner-box">
          <label htmlFor="goal-input" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '0.4rem' }}>
            What’s your main financial goal right now?
          </label>
          <textarea id="goal-input" placeholder="E.g. Buy a $700k home in 6 years, or hit $250k invested by age 30." />
          <button className="planner-btn" type="button" disabled>
            AI planning coming soon
          </button>
          <div className="planner-output">
            WealthPilot will turn your goal into a concrete roadmap with milestones, contribution targets and risk ranges — as soon as the AI backend is wired in.
          </div>
        </div>
      </section>
    </main>
  );
}