import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { timestamptz } from "./columns";

/**
 * Universe domain (`MVP-Data-Schema.md`, "Universe Domain"). Every
 * analysis run references exactly one immutable `universe_versions` row.
 * `universe_members` (which instruments belong to a given version) is
 * part of the approved spec but has no foreign-key consumer in this
 * slice — an `analysis_run` records which universe version it evaluated,
 * not the member list itself — so it's deferred to whenever the
 * ingestion pipeline (Epic E4) actually needs to populate it.
 */

export const universes = pgTable("universes", {
  id: uuid("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
});

export const universeVersions = pgTable(
  "universe_versions",
  {
    id: uuid("id").primaryKey(),
    universeId: uuid("universe_id")
      .notNull()
      .references(() => universes.id),
    version: text("version").notNull(),
    // Date the version's membership was decided as-of, not an instant —
    // matches the spec's exchange-trading-date convention elsewhere.
    asOf: date("as_of").notNull(),
    selectionMethod: text("selection_method").notNull(),
    eligibilityRules: jsonb("eligibility_rules").notNull(),
    exclusionRules: jsonb("exclusion_rules").notNull(),
    requestedCount: integer("requested_count").notNull(),
    contentFingerprint: text("content_fingerprint").notNull().unique(),
    createdAt: timestamptz("created_at").notNull(),
  },
  (table) => [unique("universe_versions_universe_id_version").on(table.universeId, table.version)],
);
