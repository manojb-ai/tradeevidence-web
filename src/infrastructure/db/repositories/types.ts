import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type * as schema from "@/src/infrastructure/db/schema";

/**
 * Every repository function in this folder is generic over `TQueryResult`
 * — the driver-specific query-result shape Drizzle threads through
 * `insert()`/`update()`/`delete()`/`transaction()`. That genericity is
 * required, not optional: postgres-js's shape (`RowList<Row[]>`) and
 * pglite's (`Results<...>`) are not assignable to each other, so a
 * non-generic type built by `Pick<>`-ing one driver's already-instantiated
 * `Database` type rejects the other driver's `db` at every call site —
 * confirmed by a real `tsc` run against this file's first version. Making
 * `AppDatabase` (and every function that takes one) generic over
 * `TQueryResult` is what lets the same repository code run against the
 * real Supabase-backed `Database` in production and an in-memory pglite
 * database in tests.
 */
export type AppDatabase<
  TQueryResult extends PgQueryResultHKT = PgQueryResultHKT,
> = PgDatabase<TQueryResult, typeof schema>;
