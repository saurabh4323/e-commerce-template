'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ─── Toggle Switch ─── */
function ModeToggle({ mode, onChange, loading }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg-dark)',
      border: '1px solid var(--border)',
      borderRadius: 50,
      padding: '4px',
      gap: 4,
      width: 'fit-content',
    }}>
      {['api', 'manual'].map(m => (
        <button
          key={m}
          onClick={() => !loading && onChange(m)}
          disabled={loading}
          style={{
            padding: '10px 28px',
            borderRadius: 50,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            background: mode === m
              ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))'
              : 'transparent',
            color: mode === m ? '#000' : 'var(--text-secondary)',
            boxShadow: mode === m ? '0 4px 15px rgba(201,168,76,0.3)' : 'none',
          }}
        >
          {m === 'api' ? '🔗 Live API' : '✏️ Manual'}
        </button>
      ))}
    </div>
  );
}

/* ─── Rate Preview Card ─── */
function RatePreviewCard({ label, value, unit, highlight }) {
  return (
    <div className="mini-rate-card" style={highlight ? { borderColor: 'rgba(76,175,121,0.4)', background: 'rgba(76,175,121,0.04)' } : {}}>
      <div className="mini-rate-metal">{label}</div>
      <div className="mini-rate-price" style={highlight ? { color: '#4caf79' } : {}}>
        {value ? `₹${Number(value).toLocaleString('en-IN')}` : '—'}
      </div>
      <div className="mini-rate-unit">{unit}</div>
    </div>
  );
}

/* ─── ADMIN PAGE ─── */
export default function AdminPage() {
  const [currentRates, setCurrentRates] = useState(null);
  const [currentMode, setCurrentMode] = useState('api'); // 'api' | 'manual'
  const [loadingRates, setLoadingRates] = useState(true);
  const [toggling, setToggling] = useState(false);

  // Live API fetch state
  const [livePreview, setLivePreview] = useState(null);
  const [fetchingLive, setFetchingLive] = useState(false);
  const [liveMsg, setLiveMsg] = useState(null);

  // Manual form state
  const [manual, setManual] = useState({ gold24k: '', gold22k: '', gold18k: '', silverGram: '', silverKg: '' });
  const [savingManual, setSavingManual] = useState(false);
  const [manualMsg, setManualMsg] = useState(null);

  // ── Load current rates on mount ──
  useEffect(() => { loadCurrentRates(); }, []);

  async function loadCurrentRates() {
    setLoadingRates(true);
    try {
      const r = await fetch('/api/rates');
      const data = await r.json();
      setCurrentRates(data);
      setCurrentMode(data.mode || 'api');
      if (data.mode === 'manual') {
        setManual({
          gold24k: data.gold24k || '',
          gold22k: data.gold22k || '',
          gold18k: data.gold18k || '',
          silverGram: data.silverGram || '',
          silverKg: data.silverKg || '',
        });
      }
    } catch { }
    setLoadingRates(false);
  }

  // ── Handle toggle ──
  async function handleModeChange(newMode) {
    if (newMode === currentMode) return;
    setToggling(true);
    setLiveMsg(null);
    setManualMsg(null);

    if (newMode === 'api') {
      // Switch to live API mode
      try {
        const r = await fetch('/api/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'set_mode_api' }),
        });
        const d = await r.json();
        if (d.success) {
          setCurrentMode('api');
          setLivePreview(null);
          await loadCurrentRates();
        }
      } catch { }
    } else {
      // Just switch UI to manual — don't save until user submits form
      setCurrentMode('manual');
    }
    setToggling(false);
  }

  // ── Fetch live preview ──
  async function handleFetchLive() {
    setFetchingLive(true);
    setLiveMsg(null);
    setLivePreview(null);
    try {
      const r = await fetch('/api/rates/live');
      const data = await r.json();
      if (data.error) {
        setLiveMsg({ type: 'error', text: `❌ ${data.error}` });
      } else {
        setLivePreview(data);
        setLiveMsg({ type: 'success', text: '✅ Rates fetched successfully from gold-api.com' });
      }
    } catch (err) {
      setLiveMsg({ type: 'error', text: `❌ Network error: ${err.message}` });
    }
    setFetchingLive(false);
  }

  // ── Auto calculate 22K / 18K from 24K ──
  function handleGold24Change(val) {
    const v = Number(val);
    setManual(p => ({
      ...p,
      gold24k: val,
      gold22k: v ? Math.round(v * 0.916) : p.gold22k,
      gold18k: v ? Math.round(v * 0.75) : p.gold18k,
    }));
  }

  // ── Auto calculate silver KG from per gram ──
  function handleSilverGramChange(val) {
    const v = Number(val);
    setManual(p => ({
      ...p,
      silverGram: val,
      silverKg: v ? Math.round(v * 1000) : p.silverKg,
    }));
  }

  // ── Save manual rates ──
  async function handleManualSave(e) {
    e.preventDefault();
    setSavingManual(true);
    setManualMsg(null);
    try {
      const r = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_manual',
          gold24k: Number(manual.gold24k),
          gold22k: Number(manual.gold22k),
          gold18k: Number(manual.gold18k),
          silverGram: Number(manual.silverGram),
          silverKg: Number(manual.silverKg),
        }),
      });
      const data = await r.json();
      if (data.success) {
        setManualMsg({ type: 'success', text: '✅ Rates published! Website now shows your manual rates.' });
        await loadCurrentRates();
      } else {
        setManualMsg({ type: 'error', text: `❌ ${data.error}` });
      }
    } catch (err) {
      setManualMsg({ type: 'error', text: `❌ ${err.message}` });
    }
    setSavingManual(false);
  }

  const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

  return (
    <div className="admin-wrapper">

      {/* ── Top Bar ── */}
      <div style={{ maxWidth: 960, margin: '0 auto 36px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34, color: 'var(--gold-light)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
            ⚙️ Admin Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Manish Jewellery · Gold & Silver Rate Management
          </p>
        </div>
        <Link href="/" className="admin-nav-link">← Back to Website</Link>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── Live Rates Status Card ── */}
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(10,10,10,0.8))' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
                Currently Showing on Website
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  display: 'inline-block',
                  width: 8, height: 8, borderRadius: '50%',
                  background: currentMode === 'api' ? '#4caf79' : '#e2c068',
                  boxShadow: `0 0 8px ${currentMode === 'api' ? '#4caf79' : '#e2c068'}`,
                }} />
                <span style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 600 }}>
                  {currentMode === 'api' ? 'Live Market Rates (Auto)' : 'Manual Rates (Set by Admin)'}
                </span>
              </div>
              {currentRates?.updatedAt && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Last updated: {new Date(currentRates.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                  {currentRates.usdToInr && <span style={{ marginLeft: 8 }}>· USD/INR: ₹{currentRates.usdToInr}</span>}
                  {currentRates.goldUsdOz && <span style={{ marginLeft: 8 }}>· Gold: ${currentRates.goldUsdOz}/oz</span>}
                </p>
              )}
            </div>
            <button className="btn-admin-outline" onClick={loadCurrentRates} disabled={loadingRates} style={{ fontSize: 12 }}>
              🔄 Refresh
            </button>
          </div>

          {loadingRates ? (
            <div className="alert alert-info">⏳ Loading current rates…</div>
          ) : currentRates ? (
            <div className="current-rates-display">
              <RatePreviewCard label="Gold 24K" value={currentRates.gold24k} unit="per 10g" />
              <RatePreviewCard label="Gold 22K" value={currentRates.gold22k} unit="per 10g" />
              <RatePreviewCard label="Gold 18K" value={currentRates.gold18k} unit="per 10g" />
              <RatePreviewCard label="Silver" value={currentRates.silverGram} unit="per gram" />
              <RatePreviewCard label="Silver Bulk" value={currentRates.silverKg} unit="per kg" />
            </div>
          ) : (
            <div className="alert alert-error">⚠️ Could not load rates.</div>
          )}
        </div>

        {/* ── Mode Toggle ── */}
        <div className="admin-card">
          <div className="admin-card-title" style={{ marginBottom: 6 }}>🔀 Rate Source Mode</div>
          <p className="admin-card-desc">
            Choose how gold &amp; silver rates are displayed on your website.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <ModeToggle mode={currentMode} onChange={handleModeChange} loading={toggling} />

            {/* Mode descriptions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 640 }}>
              <div style={{
                padding: '16px 20px',
                border: `1px solid ${currentMode === 'api' ? 'rgba(76,175,121,0.4)' : 'var(--border)'}`,
                borderRadius: 6,
                background: currentMode === 'api' ? 'rgba(76,175,121,0.04)' : 'transparent',
                transition: 'all 0.3s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: currentMode === 'api' ? '#4caf79' : 'var(--text-secondary)', marginBottom: 6 }}>
                  🔗 Live API Mode
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Rates fetched automatically from <strong style={{ color: 'var(--text-secondary)' }}>gold-api.com</strong> in real time. USD converted to INR automatically. No manual work needed.
                </p>
              </div>
              <div style={{
                padding: '16px 20px',
                border: `1px solid ${currentMode === 'manual' ? 'rgba(201,168,76,0.4)' : 'var(--border)'}`,
                borderRadius: 6,
                background: currentMode === 'manual' ? 'rgba(201,168,76,0.04)' : 'transparent',
                transition: 'all 0.3s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: currentMode === 'manual' ? 'var(--gold-light)' : 'var(--text-secondary)', marginBottom: 6 }}>
                  ✏️ Manual Mode
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  You set the gold &amp; silver rates yourself. Useful when you want to show your own store-specific pricing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── PANEL: Live API ── */}
        {currentMode === 'api' && (
          <div className="admin-card">
            <div className="admin-card-title">🔗 Live API Preview</div>
            <p className="admin-card-desc">
              Your website automatically fetches real-time rates from <strong style={{ color: 'var(--gold)' }}>gold-api.com</strong> (completely free, no API key required) and converts them to INR using live forex data. Click below to preview the current live values.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button className="btn-admin" onClick={handleFetchLive} disabled={fetchingLive}>
                {fetchingLive ? <><div className="spinner" /> Fetching from gold-api.com…</> : '⬇ Fetch Current Live Rates'}
              </button>

              {liveMsg && <div className={`alert alert-${liveMsg.type}`}>{liveMsg.text}</div>}

              {livePreview && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    📡 Source: gold-api.com · Gold: <strong style={{ color: 'var(--gold)' }}>${livePreview.goldUsdOz}/oz</strong> ·
                    Silver: <strong style={{ color: 'var(--silver)' }}>${livePreview.silverUsdOz}/oz</strong> ·
                    USD/INR: <strong style={{ color: 'var(--gold)' }}>₹{livePreview.usdToInr}</strong>
                  </p>
                  <div className="current-rates-display">
                    <RatePreviewCard label="Gold 24K" value={livePreview.gold24k} unit="per 10g" highlight />
                    <RatePreviewCard label="Gold 22K" value={livePreview.gold22k} unit="per 10g" highlight />
                    <RatePreviewCard label="Gold 18K" value={livePreview.gold18k} unit="per 10g" highlight />
                    <RatePreviewCard label="Silver" value={livePreview.silverGram} unit="per gram" highlight />
                    <RatePreviewCard label="Silver Bulk" value={livePreview.silverKg} unit="per kg" highlight />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    ℹ️ In Live API mode, these rates are fetched fresh every time a visitor loads your website.
                  </p>
                </div>
              )}

              <div className="alert alert-info" style={{ fontSize: 12 }}>
                💡 <strong>How it works:</strong> Gold &amp; Silver prices are fetched from <code style={{ background: 'rgba(201,168,76,0.1)', padding: '1px 6px', borderRadius: 3 }}>api.gold-api.com</code> (USD/oz) and USD→INR rate from <code style={{ background: 'rgba(201,168,76,0.1)', padding: '1px 6px', borderRadius: 3 }}>open.er-api.com</code>. Both are 100% free with no API key.
              </div>
            </div>
          </div>
        )}

        {/* ── PANEL: Manual ── */}
        {currentMode === 'manual' && (
          <div className="admin-card">
            <div className="admin-card-title">✏️ Set Rates Manually</div>
            <p className="admin-card-desc">
              Enter today's gold &amp; silver rates below. Enter the 24K rate — 22K and 18K will be auto-calculated. Silver per kg will auto-fill from per gram rate.
            </p>

            <form className="admin-form" onSubmit={handleManualSave}>
              {/* Gold */}
              <div>
                <p style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
                  🥇 Gold Rates — per 10 grams (₹)
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gold 24K (999 · Pure)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 78000"
                      value={manual.gold24k}
                      onChange={e => handleGold24Change(e.target.value)}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gold 22K (916 · Hallmark)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="Auto-filled from 24K"
                      value={manual.gold22k}
                      onChange={e => setManual(p => ({ ...p, gold22k: e.target.value }))}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gold 18K (750)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="Auto-filled from 24K"
                      value={manual.gold18k}
                      onChange={e => setManual(p => ({ ...p, gold18k: e.target.value }))}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              </div>

              {/* Silver */}
              <div>
                <p style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
                  🥈 Silver Rates (₹)
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Silver — per gram</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 95"
                      value={manual.silverGram}
                      onChange={e => handleSilverGramChange(e.target.value)}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Silver — per kilogram</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="Auto-filled from per gram"
                      value={manual.silverKg}
                      onChange={e => setManual(p => ({ ...p, silverKg: e.target.value }))}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {(manual.gold24k || manual.gold22k) && (
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>Preview:</p>
                  <div className="current-rates-display">
                    <RatePreviewCard label="Gold 24K" value={manual.gold24k} unit="per 10g" highlight />
                    <RatePreviewCard label="Gold 22K" value={manual.gold22k} unit="per 10g" highlight />
                    <RatePreviewCard label="Gold 18K" value={manual.gold18k} unit="per 10g" highlight />
                    <RatePreviewCard label="Silver" value={manual.silverGram} unit="per gram" highlight />
                    <RatePreviewCard label="Silver Bulk" value={manual.silverKg} unit="per kg" highlight />
                  </div>
                </div>
              )}

              {manualMsg && <div className={`alert alert-${manualMsg.type}`}>{manualMsg.text}</div>}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button type="submit" className="btn-admin" disabled={savingManual}>
                  {savingManual ? <><div className="spinner" />Publishing…</> : '🚀 Publish Rates to Website'}
                </button>
                <button
                  type="button"
                  className="btn-admin-outline"
                  onClick={() => setManual({ gold24k: '', gold22k: '', gold18k: '', silverGram: '', silverKg: '' })}
                >
                  🗑 Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Info Footer ── */}
        <div className="admin-card" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { icon: '🆓', title: 'Completely Free', desc: 'gold-api.com requires no API key. 100% free forever.' },
              { icon: '⚡', title: 'Real-Time', desc: 'Rates update every time a visitor loads your website.' },
              { icon: '💱', title: 'INR Conversion', desc: 'USD → INR auto-converted using live forex data.' },
              { icon: '🛡️', title: 'Fallback Safe', desc: 'If API fails, last known rates are shown automatically.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, color: 'var(--gold-light)', marginBottom: 6, fontFamily: 'Cormorant Garamond, serif' }}>{item.title}</div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
