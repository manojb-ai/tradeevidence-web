/**
 * Structured, correlation-safe logging (Epic E1, AC-08;
 * `docs/engineering/Observability-and-Operations.md`: "structured logs",
 * "Every request receives a support-safe correlation ID", and "Secrets,
 * tokens, private bodies, unnecessary personal information ... are not
 * logged by default").
 *
 * Deliberately minimal: no external observability vendor has been chosen
 * (`Vertical-Slice-01-Delivery-Foundation.md` Section 10's open question
 * remains open). This writes one JSON object per line to stdout/stderr,
 * which Vercel's own Runtime Logs capture natively with zero
 * configuration and zero cost — sufficient to close AC-08 ("logs and
 * responses can be correlated safely") without a vendor decision. If an
 * observability vendor is chosen later, this module is the one seam to
 * redirect (or additionally forward) output through; call sites never
 * need to change.
 *
 * Callers are responsible for only passing safe fields — this module
 * does not attempt to detect or redact secrets. Never pass a request
 * body, token, password, or full AI conversation as a field.
 */

type LogLevel = "info" | "warn" | "error";

export type LogFields = Record<string, string | number | boolean | null>;

function write(level: LogLevel, message: string, fields: LogFields): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields,
  };
  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

/** Routine, expected events — e.g. a successful health check. */
export function logInfo(message: string, fields: LogFields = {}): void {
  write("info", message, fields);
}

/** Recoverable or degraded-but-handled conditions. */
export function logWarn(message: string, fields: LogFields = {}): void {
  write("warn", message, fields);
}

/** Failures that need attention. */
export function logError(message: string, fields: LogFields = {}): void {
  write("error", message, fields);
}
