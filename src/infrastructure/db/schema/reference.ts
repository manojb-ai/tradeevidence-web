import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { checkEnum, timestamptz } from "./columns";

/**
 * Reference domain (`docs/engineering/MVP-Data-Schema.md`, "Reference
 * Domain"). Instrument identity is stable across ticker/exchange changes
 * — nothing here uses ticker or exchange as identity. `instrument_listings`,
 * `instrument_sector_memberships`, `benchmarks`, and `corporate_actions`
 * are part of this domain per the spec but are not needed by the
 * analytical-run slice this migration covers (nothing in that slice
 * references them by foreign key); they're deferred to a follow-up
 * session rather than built ahead of anything that uses them.
 */

const INSTRUMENT_TYPES = [
  "COMMON_STOCK",
  "DEPOSITARY_RECEIPT",
  "REIT",
  "ETF",
  "MLP",
  "REGISTERED_SHARE",
  "CLOSED_END_FUND",
  "TRACKING_STOCK",
] as const;

const INSTRUMENT_STATUSES = [
  "active",
  "inactive",
  "delisted",
  "acquired",
  "unknown",
] as const;

export const instruments = pgTable(
  "instruments",
  {
    id: uuid("id").primaryKey(),
    instrumentType: text("instrument_type").notNull(),
    legalName: text("legal_name").notNull(),
    status: text("status").notNull(),
    createdAt: timestamptz("created_at").notNull(),
  },
  (table) => [
    checkEnum(
      "instruments_instrument_type_check",
      table.instrumentType,
      INSTRUMENT_TYPES,
    ),
    checkEnum("instruments_status_check", table.status, INSTRUMENT_STATUSES),
  ],
);

/**
 * `sectors` per the spec ("stable IDs and canonical codes"). The fuller
 * `instrument_sector_memberships` table (dated, versioned membership) is
 * deferred — this slice only needs a sector to exist and be referenceable
 * from `sector_context_snapshots`.
 */
export const sectors = pgTable("sectors", {
  id: uuid("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
});
