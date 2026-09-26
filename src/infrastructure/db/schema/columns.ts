import { sql } from "drizzle-orm";
import { check, type AnyPgColumn } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";

/**
 * Every instant in this schema is `timestamptz`
 * (`docs/engineering/MVP-Data-Schema.md`, "Identity Rules": "All
 * timestamps representing an instant use PostgreSQL timestamptz").
 * Drizzle's pg-core has no separate `timestamptz` helper — it's
 * `timestamp(name, { withTimezone: true })` — so this wrapper is the one
 * place that fact lives, instead of repeating the option object (and
 * risking someone forgetting it) at every column definition.
 */
export function timestamptz(name: string) {
  return timestamp(name, { withTimezone: true, mode: "string" });
}

/**
 * A `text` column restricted to a fixed set of values via a Postgres
 * CHECK constraint, matching how `MVP-Data-Schema.md` documents these
 * columns: `text` with a listed set of allowed values, not a native
 * Postgres `enum` type (native enums are awkward to extend later —
 * `ALTER TYPE ... ADD VALUE` has real restrictions — and the spec's own
 * "Versioning and Migration Policy" section treats schema evolution as
 * routine, so plain `text` + `CHECK` keeps that cheap).
 */
export function checkEnum<T extends string>(
  constraintName: string,
  column: AnyPgColumn,
  values: readonly T[],
) {
  const list = values.map((value) => `'${value}'`).join(", ");
  return check(constraintName, sql`${column} in (${sql.raw(list)})`);
}
