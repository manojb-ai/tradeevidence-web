export type Direction = "Bullish" | "Bearish" | "Watch";

export type DemoOpportunity = {
  symbol: string;
  name: string;
  direction: Direction;
  timeframe: "Daily" | "Weekly";
  evidenceScore: number;
  principalSupport: string;
  keyConstraint: string;
  trendEvidence: string;
  momentumEvidence: string;
  contradiction: string;
  invalidation: string;
};

export const demoSnapshot = {
  marketDate: "Illustrative session",
  analysisRunId: "demo-run-001",
  rulesetVersion: "evidence-v2-demo",
  coverage: 100,
} as const;

export const demoOpportunities: DemoOpportunity[] = [
  {
    symbol: "ALPH",
    name: "Alpha Systems · fictional",
    direction: "Bullish",
    timeframe: "Daily",
    evidenceScore: 82,
    principalSupport:
      "Daily trend and momentum are aligned above their reference zones.",
    keyConstraint:
      "Weekly momentum has improved but has not confirmed the daily move.",
    trendEvidence:
      "Price structure is rising on the daily timeframe and remains constructive weekly.",
    momentumEvidence:
      "Daily momentum is positive and strengthening from a neutral region.",
    contradiction:
      "The monthly timeframe is still range-bound, limiting longer-horizon confirmation.",
    invalidation:
      "Reassess if the daily structure loses its most recent higher low.",
  },
  {
    symbol: "BRVO",
    name: "Bravo Materials · fictional",
    direction: "Bearish",
    timeframe: "Weekly",
    evidenceScore: 77,
    principalSupport: "Weekly trend and momentum are aligned to the downside.",
    keyConstraint:
      "Daily momentum is stretched and may allow a counter-trend bounce.",
    trendEvidence:
      "Weekly price structure is declining beneath its reference trend zone.",
    momentumEvidence:
      "Momentum remains negative across the weekly and daily evidence windows.",
    contradiction:
      "Short-term selling pressure is extended, which can make entry timing less favorable.",
    invalidation:
      "Reassess if weekly structure recovers above the latest lower high.",
  },
  {
    symbol: "CRST",
    name: "Crest Retail · fictional",
    direction: "Watch",
    timeframe: "Daily",
    evidenceScore: 64,
    principalSupport:
      "Daily momentum is improving while price tests a defined trend boundary.",
    keyConstraint:
      "Weekly trend remains neutral, so directional alignment is incomplete.",
    trendEvidence:
      "Daily structure is attempting to improve but has not established a durable trend.",
    momentumEvidence:
      "Momentum has crossed into a constructive zone on the daily timeframe.",
    contradiction:
      "Weekly and monthly evidence remain mixed rather than confirming the daily setup.",
    invalidation:
      "Remove from watch if momentum fades and price returns below the recent range.",
  },
];

export function findDemoOpportunity(symbol: string) {
  return demoOpportunities.find(
    (opportunity) => opportunity.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}
