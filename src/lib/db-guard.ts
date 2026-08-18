export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error) return false;

  const messages: string[] = [];
  const visited = new Set<unknown>();

  function collect(value: unknown) {
    if (!value || visited.has(value)) return;
    visited.add(value);

    if (value instanceof Error) messages.push(value.message);
    else if (typeof value === "string") messages.push(value);

    if (typeof value !== "object") return;
    const nested = value as { cause?: unknown; errors?: unknown[] };
    collect(nested.cause);
    nested.errors?.forEach(collect);
  }

  collect(error);

  return /ENOTFOUND|ECONNREFUSED|EAI_AGAIN|timeout|database.*required|connection.*failed|SASL|password must be a string|authentication failed/i.test(
    messages.join(" ")
  );
}

export async function withDbFallback<T>(callback: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return fallback;
    }

    throw error;
  }
}
