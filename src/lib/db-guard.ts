export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error) return false;

  const message = error instanceof Error ? error.message : String(error);
  const cause =
    typeof error === "object" && error !== null && "cause" in error
      ? String((error as { cause?: unknown }).cause ?? "")
      : "";

  return /ENOTFOUND|ECONNREFUSED|EAI_AGAIN|timeout|database.*required|connection.*failed/i.test(
    `${message} ${cause}`
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
