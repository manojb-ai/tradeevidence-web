import { describe, expect, it } from "vitest";

import {
  findInstrumentById,
  findInstrumentsByIds,
  findSectorByCode,
  insertInstrument,
  insertSector,
} from "@/src/infrastructure/db/repositories/reference-repository";
import { createTestDatabase } from "@/src/infrastructure/db/test-utils/create-test-database";

describe("reference repository (pglite)", () => {
  it("inserts and re-reads an instrument", async () => {
    const db = await createTestDatabase();

    const instrument = await insertInstrument(db, {
      instrumentType: "COMMON_STOCK",
      legalName: "SPDR S&P 500 ETF Trust",
      status: "active",
    });

    expect(instrument.instrumentType).toBe("COMMON_STOCK");

    const fetched = await findInstrumentById(db, instrument.id);
    expect(fetched?.legalName).toBe("SPDR S&P 500 ETF Trust");
    expect(fetched?.status).toBe("active");
  });

  it("rejects an instrument_type outside the governed enum at the database level", async () => {
    const db = await createTestDatabase();

    await expect(
      insertInstrument(db, {
        // Cast bypasses the TypeScript union deliberately, to prove the
        // database's own CHECK constraint enforces this — not just the
        // application-level type — since a bad value could otherwise
        // reach the database through any future non-TypeScript caller.
        instrumentType: "NOT_A_REAL_TYPE" as never,
        legalName: "Bogus Co",
        status: "active",
      }),
    ).rejects.toThrow();
  });

  it("finds multiple instruments by id, ignoring ids that don't exist", async () => {
    const db = await createTestDatabase();
    const first = await insertInstrument(db, {
      instrumentType: "ETF",
      legalName: "First",
      status: "active",
    });
    const second = await insertInstrument(db, {
      instrumentType: "ETF",
      legalName: "Second",
      status: "active",
    });

    const found = await findInstrumentsByIds(db, [
      first.id,
      second.id,
      "00000000-0000-0000-0000-000000000000",
    ]);

    expect(found.map((row) => row.legalName).sort()).toEqual([
      "First",
      "Second",
    ]);
  });

  it("inserts and re-reads a sector by code", async () => {
    const db = await createTestDatabase();

    await insertSector(db, { code: "TECH", name: "Technology" });

    const fetched = await findSectorByCode(db, "TECH");
    expect(fetched?.name).toBe("Technology");
  });

  it("returns null for a sector code that does not exist", async () => {
    const db = await createTestDatabase();

    expect(await findSectorByCode(db, "NOPE")).toBeNull();
  });
});
