/**
 * Reference domain types (mirrors `src/infrastructure/db/schema/reference.ts`).
 */

export type InstrumentType =
  | "COMMON_STOCK"
  | "DEPOSITARY_RECEIPT"
  | "REIT"
  | "ETF"
  | "MLP"
  | "REGISTERED_SHARE"
  | "CLOSED_END_FUND"
  | "TRACKING_STOCK";

export type InstrumentStatus =
  "active" | "inactive" | "delisted" | "acquired" | "unknown";

export type Instrument = {
  id: string;
  instrumentType: InstrumentType;
  legalName: string;
  status: InstrumentStatus;
  createdAt: string;
};

export type NewInstrumentInput = {
  instrumentType: InstrumentType;
  legalName: string;
  status: InstrumentStatus;
};

export type Sector = {
  id: string;
  code: string;
  name: string;
};

export type NewSectorInput = {
  code: string;
  name: string;
};
