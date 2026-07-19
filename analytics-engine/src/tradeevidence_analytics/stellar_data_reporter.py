"""
stellar_data_reporter.py
------------------------
Website-ready HTML + JSON report generator.
"""

from __future__ import annotations

from pathlib import Path
from datetime import datetime
from html import escape
import json
from typing import List, Tuple

from .stellar_data_engine import TradeResult, ENGINE_VERSION, RULESET_VERSION


def _fmt_num(x, decimals=1):
    if x is None:
        return "N/A"
    try:
        return f"{float(x):.{decimals}f}"
    except Exception:
        return "N/A"


def _fmt_pct(x):
    if x is None:
        return "N/A"
    try:
        return f"{float(x):.1f}%"
    except Exception:
        return "N/A"


def _badge(label, kind="neutral"):
    styles = {
        "green": "background:#d1fae5;color:#065f46;",
        "yellow": "background:#fef3c7;color:#92400e;",
        "red": "background:#fee2e2;color:#991b1b;",
        "blue": "background:#dbeafe;color:#1e40af;",
        "orange": "background:#ffedd5;color:#9a3412;",
        "neutral": "background:#f3f4f6;color:#374151;",
    }
    return f'<span class="badge" style="{styles.get(kind, styles["neutral"])}">{escape(str(label))}</span>'


def _setup_kind(label):
    if "Prime" in label or "Active Momentum" in label:
        return "green"
    if "Developing" in label:
        return "yellow"
    return "neutral"


def _momentum_kind(label):
    if any(x in label for x in ["Positive", "Turning Up", "Improving", "Stable"]):
        return "green" if "Positive" in label or "Turning Up" in label else "yellow"
    if any(x in label for x in ["Bearish", "Weakening"]):
        return "red"
    return "neutral"


def _strength_kind(label):
    if label in {"Strong", "Very Strong", "Healthy"}:
        return "blue"
    if label == "Emerging":
        return "yellow"
    if label == "Weak":
        return "neutral"
    return "neutral"


def _premium_kind(label):
    if label in {"High", "Very High"}:
        return "orange"
    if label == "Medium":
        return "blue"
    return "neutral"


def _verdict_badge(verdict):
    if verdict == "YES":
        return _badge("YES", "green")
    if verdict == "WATCH":
        return _badge("WATCH", "yellow")
    return _badge("NO", "red")


def _strategy_table(strategies):
    rows = []
    for i, s in enumerate(strategies, 1):
        rows.append(f"""
        <tr>
          <td class="rank">{i}</td>
          <td><b>{escape(s['name'])}</b><br><span class="muted">{escape(s['description'])}</span><br><span class="why">{escape(s['why'])}</span></td>
          <td>{escape(s['fit'])}<br><span class="muted">{s['fit_score']}/100</span></td>
          <td>{escape(s['capital'])}</td>
          <td>{escape(s['risk'])}<br><span class="muted">{escape(s['risk_detail'])}</span></td>
          <td>{escape(s['pros'])}</td>
          <td>{escape(s['cons'])}</td>
        </tr>""")
    return f"""
    <table class="strategy-table">
      <thead><tr><th>#</th><th>Preferred strategy</th><th>Fit</th><th>Capital</th><th>Risk</th><th>Pros</th><th>Cons</th></tr></thead>
      <tbody>{''.join(rows)}</tbody>
    </table>"""


def _card(r: TradeResult) -> str:
    d = r.data
    verdict = escape(r.verdict)
    symbol = escape(r.symbol)
    ds = d.get("daily_setup_display", "Unknown")
    ws = d.get("weekly_setup_display", "Unknown")
    ms = d.get("monthly_setup_display", "Unknown")
    dm = d.get("daily_momentum_display", "Unknown")
    wm = d.get("weekly_momentum_display", "Unknown")
    strength = d.get("directional_strength_display", "Unknown")
    premium = d.get("option_premium_display", "Unknown")
    location = d.get("entry_zone", d.get("market_location", "Unknown"))
    structure = d.get("trend_structure", "Unknown")

    adx = _fmt_num(d.get("adx"), 0)
    iv = _fmt_num(d.get("iv"), 0)
    pct21 = _fmt_pct(d.get("pct_from_ema21"))
    pct50 = _fmt_pct(d.get("pct_from_sma50"))
    pct200 = _fmt_pct(d.get("pct_from_sma200"))

    reason_items = "".join(f"<li>{escape(x)}</li>" for x in r.reasoning)
    risk_items = "".join(f"<li>{escape(x)}</li>" for x in r.risk_flags)

    return f"""
    <article class="card trade-card" data-symbol="{symbol}" data-verdict="{verdict}" data-score="{r.score}">
      <div class="card-head">
        <div>
          <span class="symbol">{symbol}</span>
          {_verdict_badge(r.verdict)}
          <span class="score">TradeEvidence Score: {r.score}/100 · {escape(r.confidence)}</span>
        </div>
        <div class="muted metrics-line">
          <span><b>Directional Strength:</b> {escape(strength)} ({adx})</span>
          <span class="dotsep">·</span>
          <span><b>Option Premium:</b> {escape(premium)} ({iv}%)</span>
          <span class="dotsep">·</span>
          <span><b>Entry Zone:</b> {escape(location)} ({pct21})</span>
        </div>
      </div>

      <div class="summary-box"><b>Market story:</b> {escape(r.market_story)}</div>
      <div class="summary-box light"><b>Decision summary:</b> {escape(r.decision_summary)}</div>

      <div class="grid market-assessment">
        <div>
          <h4>Setup</h4>
          <div class="pill-row">Daily {_badge(ds, _setup_kind(ds))}</div>
          <div class="pill-row">Weekly {_badge(ws, _setup_kind(ws))}</div>
          <div class="pill-row">Monthly {_badge(ms, _setup_kind(ms))}</div>
        </div>
        <div>
          <h4>Momentum, trend, and location</h4>
          <div class="pill-row">Daily momentum {_badge(dm, _momentum_kind(dm))}</div>
          <div class="pill-row">Weekly trend {_badge(wm, _momentum_kind(wm))}</div>
          <div class="pill-row">Directional Strength {_badge(f"{strength} ({adx})", _strength_kind(strength))}</div>
          <div class="pill-row">Option Premium {_badge(f"{premium} ({iv}%)", _premium_kind(premium))}</div>
          <div class="pill-row">Entry Zone {_badge(f"{location} ({pct21} vs 21 EMA)", "blue" if "Extended" not in location else "yellow")}</div>
          <div class="pill-row">Trend Structure {_badge(structure, "neutral")}</div>
        </div>
      </div>

      <div class="summary-box light">
        <b>Moving average context:</b>
        Last {escape(_fmt_num(d.get("last"), 2))} ·
        21 EMA {escape(_fmt_num(d.get("ema21"), 2))} ({pct21}) ·
        50 SMA {escape(_fmt_num(d.get("sma50"), 2))} ({pct50}) ·
        200 SMA {escape(_fmt_num(d.get("sma200"), 2))} ({pct200})
      </div>

      <div class="explain">
        <div><h4>Why this ranking</h4><ul>{reason_items}</ul></div>
        <div><h4>Risk flags</h4><ul>{risk_items}</ul></div>
      </div>

      <h4>Strategies, ranked by fit</h4>
      {_strategy_table(r.strategies)}
    </article>"""


def _section(title, klass, items):
    if not items:
        return ""
    return f'<h2 class="section {klass}">{title} ({len(items)})</h2>' + "".join(_card(r) for r in items)


def generate_fast_report(results: List[TradeResult], output_dir: Path, source_file: str = "watchlist.csv") -> Tuple[Path, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = output_dir / f"fast_report_{timestamp}.html"
    json_path = output_dir / f"fast_report_{timestamp}.json"

    yes = [r for r in results if r.verdict == "YES"]
    watch = [r for r in results if r.verdict == "WATCH"]
    no = [r for r in results if r.verdict == "NO"]

    report_json = {
        "engine_version": ENGINE_VERSION,
        "ruleset_version": RULESET_VERSION,
        "source_file": source_file,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "summary": {"rows_scored": len(results), "yes": len(yes), "watch": len(watch), "no": len(no)},
        "results": [r.to_json() for r in results],
    }
    json_blob = json.dumps(report_json, indent=2)
    json_path.write_text(json_blob, encoding="utf-8")

    sections_html = (
        _section("✅ YES — High-quality opportunities", "green", yes)
        + _section("👀 WATCH — Monitor / secondary candidates", "yellow", watch)
        + _section("❌ NO — Low alignment / avoid for now", "red", no)
    )

    generated = datetime.now().strftime("%A, %B %d %Y at %H:%M")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TradeEvidence Decision Report — {datetime.now().strftime('%b %d %Y %H:%M')}</title>
<meta name="tradeevidence:engine" content="{escape(ENGINE_VERSION)}">
<meta name="tradeevidence:ruleset" content="{escape(RULESET_VERSION)}">
<style>
  body {{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#f9fafb; color:#111827; margin:0; padding:24px; }}
  .container {{ max-width:1250px; margin:0 auto; }}
  h1 {{ font-size:26px; margin:0 0 6px; }}
  h2.section {{ margin:28px 0 14px; }}
  h2.green {{ color:#065f46; }} h2.yellow {{ color:#92400e; }} h2.red {{ color:#991b1b; }}
  h4 {{ margin:12px 0 8px; }}
  .meta {{ color:#6b7280; font-size:14px; margin-bottom:20px; line-height:1.5; }}
  .notice {{ background:#fff7ed; border:1px solid #fed7aa; color:#7c2d12; border-radius:12px; padding:12px 14px; margin:16px 0 22px; font-size:13px; line-height:1.45; }}
  .summary {{ display:flex; gap:14px; flex-wrap:wrap; margin-bottom:22px; }}
  .stat {{ background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:14px 22px; text-align:center; }}
  .stat-num {{ font-size:26px; font-weight:800; }} .stat-label {{ color:#6b7280; font-size:12px; }}
  .card {{ background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px; margin-bottom:18px; box-shadow:0 1px 2px rgba(0,0,0,.03); }}
  .card-head {{ display:flex; justify-content:space-between; gap:12px; align-items:flex-start; margin-bottom:12px; }}
  .symbol {{ font-size:24px; font-weight:800; font-family:monospace; margin-right:10px; }}
  .score {{ color:#374151; font-size:13px; margin-left:8px; }} .muted {{ color:#6b7280; font-size:12px; }}
  .metrics-line {{ text-align:right; }} .dotsep {{ margin:0 4px; color:#9ca3af; }}
  .badge {{ display:inline-block; padding:2px 8px; border-radius:999px; font-size:12px; font-weight:700; margin:2px; }}
  .summary-box {{ background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; margin:8px 0 14px; font-size:13px; line-height:1.45; }}
  .summary-box.light {{ background:#ffffff; }}
  .grid {{ display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:8px 0 12px; }}
  .explain {{ display:grid; grid-template-columns:1fr 1fr; gap:20px; }}
  .pill-row {{ margin:4px 0; font-size:13px; }} ul {{ margin:6px 0 10px 20px; padding:0; }} li {{ margin:3px 0; }}
  table {{ width:100%; border-collapse:collapse; font-size:13px; }} th {{ text-align:left; color:#6b7280; background:#f9fafb; padding:8px; border-bottom:1px solid #e5e7eb; }}
  td {{ vertical-align:top; padding:8px; border-bottom:1px solid #f3f4f6; }} .strategy-table td:nth-child(2) {{ min-width:240px; }}
  .rank {{ font-weight:800; color:#374151; }} .why {{ color:#374151; display:block; margin-top:4px; }}
  footer {{ color:#6b7280; font-size:12px; line-height:1.5; margin-top:30px; padding-top:18px; border-top:1px solid #e5e7eb; }}
  @media (max-width:900px) {{ .grid,.explain,.card-head {{ display:block; }} .metrics-line {{ text-align:left; margin-top:8px; }} }}
</style>
</head>
<body>
<div class="container" id="tradeevidence-report" data-engine-version="{escape(ENGINE_VERSION)}" data-ruleset-version="{escape(RULESET_VERSION)}">
  <h1>TradeEvidence Decision Report</h1>
  <div class="meta">
    Generated {escape(generated)}<br>
    <b>Input file:</b> {escape(source_file)}<br>
    <b>Engine:</b> Structured setup + momentum/trend + Directional Strength + Option Premium + Entry Zone. No TOS navigation. No chart screenshots.<br>
    <b>Engine version:</b> {escape(ENGINE_VERSION)} · <b>Ruleset:</b> {escape(RULESET_VERSION)}<br>
    <b>Website data:</b> JSON sidecar saved as {escape(json_path.name)} and embedded in this HTML.
  </div>
  <div class="notice"><b>Educational use only — not financial advice.</b><br>TradeEvidence is an educational market analysis and strategy research tool. Scores, rankings, setups, market stories, and strategy suggestions are generated from predefined analytical rules and are provided for educational purposes only. They are not financial, investment, legal, tax, or trading advice. Trading and investing involve risk, including the possible loss of capital. Users are responsible for their own due diligence and for deciding whether any strategy is appropriate for their objectives, experience, and risk tolerance.</div>
  <div class="summary">
    <div class="stat"><div class="stat-num">{len(results)}</div><div class="stat-label">Rows scored</div></div>
    <div class="stat"><div class="stat-num" style="color:#065f46">{len(yes)}</div><div class="stat-label">YES</div></div>
    <div class="stat"><div class="stat-num" style="color:#92400e">{len(watch)}</div><div class="stat-label">WATCH</div></div>
    <div class="stat"><div class="stat-num" style="color:#991b1b">{len(no)}</div><div class="stat-label">NO</div></div>
  </div>
  {sections_html}
  <footer>
    <b>TradeEvidence educational notice:</b> This report is for education and research only. It is not a recommendation to buy, sell, hold, or trade any security or option strategy. Strategy examples are generalized and may not account for liquidity, spreads, assignment risk, commissions, taxes, earnings events, or individual circumstances.
  </footer>
  <script id="tradeevidence-data" type="application/json">
{escape(json_blob)}
  </script>
</div>
</body>
</html>"""

    report_path.write_text(html, encoding="utf-8")
    return report_path, json_path
