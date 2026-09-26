import {
  check,
  date,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { checkEnum, timestamptz } from "./columns";
import { instruments } from "./reference";

/**
 * Market-data domain (`MVP-Data-Schema.md`, "Market-Data Domain").
 * Provider credentials are never stored here — `market_data_sources` and
 * `market_data_versions` identify *which* provider/dataset an observation
 * came from, never how to authenticate to it.
 */

export const marketDataSources = pgTable("market_data_sources", {
  id: uuid("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
});

export const marketDataVersions = pgTable(
  "market_data_versions",
  {
    id: uuid("id").primaryKey(),
    marketDataSourceId: uuid("market_data_source_id")
      .notNull()
      .references(() => marketDataSources.id),
    versionLabel: text("version_label").notNull(),
    importedAt: timestamptz("imported_at").notNull(),
    contentFingerprint: text("content_fingerprint").notNull().unique(),
  },
  (table) => [
    unique("market_data_versions_source_id_version_label").on(
      table.marketDataSourceId,
      table.versionLabel,
    ),
  ],
);

const OBSERVATION_TYPES = ["eod", "intraday", "realtime"] as const;
const TRADING_SESSIONS = ["regular", "premarket", "afterhours"] as const;

/**
 * Phase 1's exact comparison basis is `eod + regular + 1d +
 * official_close` (spec, "Market-Data Domain"). Queries elsewhere must
 * reject mixing observation bases — that's an application-layer rule
 * (checked in the repository, not expressible as a single-row CHECK
 * constraint here, since it's a cross-query consistency rule, not a
 * per-row one).
 */
export const marketObservations = pgTable(
  "market_observations",
  {
    id: uuid("id").primaryKey(),
    instrumentId: uuid("instrument_id")
      .notNull()
      .references(() => instruments.id),
    marketDataVersionId: uuid("market_data_version_id")
      .notNull()
      .references(() => marketDataVersions.id),
    observationType: text("observation_type").notNull(),
    tradingSession: text("trading_session").notNull(),
    barInterval: text("bar_interval").notNull(),
    observationPoint: text("observation_point").notNull(),
    marketDate: date("market_date").notNull(),
    observedAt: timestamptz("observed_at").notNull(),
    exchangeTimezone: text("exchange_timezone").notNull(),
    open: numeric("open").notNull(),
    high: numeric("high").notNull(),
    low: numeric("low").notNull(),
    close: numeric("close").notNull(),
    volume: numeric("volume").notNull(),
    canonicalPrice: numeric("canonical_price").notNull(),
    adjustmentPolicy: text("adjustment_policy").notNull(),
    // Nullable only when no corporate-action adjustment applies (spec).
    corporateActionVersion: text("corporate_action_version"),
  },
  (table) => [
    unique("market_observations_identity").on(
      table.instrumentId,
      table.observationType,
      table.tradingSession,
      table.barInterval,
      table.observationPoint,
      table.observedAt,
      table.marketDataVersionId,
    ),
    checkEnum(
      "market_observations_observation_type_check",
      table.observationType,
      OBSERVATION_TYPES,
    ),
    checkEnum(
      "market_observations_trading_session_check",
      table.tradingSession,
      TRADING_SESSIONS,
    ),
    check(
      "market_observations_nonnegative_check",
      sql`${table.open} >= 0 and ${table.high} >= 0 and ${table.low} >= 0 and ${table.close} >= 0 and ${table.volume} >= 0 and ${table.canonicalPrice} >= 0`,
    ),
    check(
      "market_observations_ohlc_consistency_check",
      sql`${table.high} >= ${table.open} and ${table.high} >= ${table.close} and ${table.high} >= ${table.low} and ${table.low} <= ${table.open} and ${table.low} <= ${table.close}`,
    ),
  ],
);
