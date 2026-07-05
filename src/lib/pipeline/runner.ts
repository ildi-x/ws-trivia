export type PipelineStats = {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
};

export function createStats(): PipelineStats {
  return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
}

export function logProgress(message: string): void {
  console.log(message);
}

export function logError(message: string, error?: unknown): void {
  if (error instanceof Error) {
    console.error(`${message}: ${error.message}`);
  } else if (error) {
    console.error(`${message}:`, error);
  } else {
    console.error(message);
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  label = "operation",
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        logProgress(`Retry ${attempt}/${retries - 1} for ${label} in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError ?? new Error(`${label} failed`);
}

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--full" || arg === "--force") {
      args[arg.slice(2)] = true;
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }

  return args;
}

export function getNumberArg(
  args: Record<string, string | boolean>,
  key: string,
  fallback: number,
): number {
  const value = args[key];
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
