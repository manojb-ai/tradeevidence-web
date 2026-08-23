"""Local review artifacts for the candidate direction-aware engine."""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from html import escape
import json
from pathlib import Path
from typing import Iterable, Tuple

from .evidence_models import EvidenceSnapshot


def _card(snapshot: EvidenceSnapshot) -> str:
    score = "No score" if snapshot.alignment_score is None else f"{snapshot.alignment_score}/100"
    factor_rows = "".join(
        f"<tr><td>{escape(f.factor_code)}</td><td>{escape(f.observed_state)}</td>"
        f"<td>{f.bullish}</td><td>{f.bearish}</td><td>{f.neutral}</td>"
        f"<td>{f.unavailable}</td><td>{escape(f.effect.value)}</td></tr>"
        for f in snapshot.factors
    )
    return f"""
    <article class="card" data-symbol="{escape(snapshot.symbol_at_observation)}" data-classification="{snapshot.classification.value}">
      <h2>{escape(snapshot.symbol_at_observation)} · {escape(snapshot.classification.value.replace('_', ' ').title())}</h2>
      <p><strong>{score}</strong> · Coverage {snapshot.coverage}% · {escape(snapshot.alignment_band or 'incomplete')}</p>
      <p>{escape(snapshot.summary)}</p>
      <p>Principal support: {escape(snapshot.principal_support or 'none')} · Principal contradiction: {escape(snapshot.principal_contradiction or 'none')}</p>
      <table><thead><tr><th>Factor</th><th>State</th><th>Bull</th><th>Bear</th><th>Neutral</th><th>Unavailable</th><th>Effect</th></tr></thead><tbody>{factor_rows}</tbody></table>
    </article>"""


def generate_evidence_report(
    snapshots: Iterable[EvidenceSnapshot], output_dir: Path, source_file: str
) -> Tuple[Path, Path]:
    snapshots = list(snapshots)
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%SZ")
    counts = Counter(item.classification.value for item in snapshots)
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceFile": source_file,
        "candidateNotice": "Provisional deterministic rules; not predictive or historically validated.",
        "summary": {"rowsEvaluated": len(snapshots), "classifications": dict(sorted(counts.items()))},
        "results": [item.to_json() for item in snapshots],
    }
    json_path = output_dir / f"evidence_v2_{timestamp}.json"
    json_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    cards = "".join(_card(item) for item in snapshots)
    html = f"""<!doctype html><html><head><meta charset="utf-8"><title>TradeEvidence Evidence Engine v2 Candidate</title>
    <style>body{{font-family:system-ui;margin:2rem;background:#f4f6f8;color:#17202a}}.notice{{padding:1rem;background:#fff4ce;border:1px solid #d6a800}}.card{{background:white;margin:1rem 0;padding:1rem;border-radius:.5rem}}table{{border-collapse:collapse;width:100%}}th,td{{padding:.35rem;border-bottom:1px solid #ddd;text-align:left}}</style></head><body>
    <h1>TradeEvidence Evidence Engine v2 Candidate</h1><p class="notice">Provisional deterministic rules. Educational research output only; not predictive, historically validated, or advisory.</p>
    <p>Rows: {len(snapshots)} · {escape(str(dict(sorted(counts.items()))))}</p>{cards}</body></html>"""
    html_path = output_dir / f"evidence_v2_{timestamp}.html"
    html_path.write_text(html, encoding="utf-8")
    return html_path, json_path
