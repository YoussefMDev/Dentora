import { rateLimit, type Options, type Store } from 'express-rate-limit';
import { RateLimitStoreUnavailableError } from '../middleware/error-handler.js';
import { safeWriteLog, writeLog, type LogSink } from '../middleware/request-context.js';

export const rateLimitPolicyNames = [
  'login',
  'invitation',
  'password-recovery',
  'booking',
  'contact',
] as const;

export type RateLimitPolicyName = (typeof rateLimitPolicyNames)[number];
export type StoreFailurePolicy = 'fail-closed' | 'fail-open';

export interface RateLimitConfiguration {
  name: RateLimitPolicyName;
  limit: number;
  windowMs: number;
  store: Store;
  storeFailurePolicy: StoreFailurePolicy;
  log?: LogSink;
}

function unavailableStore(
  name: RateLimitPolicyName,
  log: LogSink,
): RateLimitStoreUnavailableError {
  safeWriteLog(log, { event: 'rate_limit_store_failure', policy: name });
  return new RateLimitStoreUnavailableError();
}

function guardedStore(store: Store, name: RateLimitPolicyName, log: LogSink): Store {
  let initializationFailed = false;
  let initialization: Promise<void> = Promise.resolve();

  async function ensureInitialized(): Promise<void> {
    await initialization;
    if (initializationFailed) {
      throw unavailableStore(name, log);
    }
  }

  const guarded: Store = {
    increment: async (key) => {
      await ensureInitialized();
      try {
        return await store.increment(key);
      } catch {
        throw unavailableStore(name, log);
      }
    },
    decrement: async (key) => {
      await ensureInitialized();
      try {
        await store.decrement(key);
      } catch {
        throw unavailableStore(name, log);
      }
    },
    resetKey: async (key) => {
      await ensureInitialized();
      try {
        await store.resetKey(key);
      } catch {
        throw unavailableStore(name, log);
      }
    },
    ...(store.get
      ? {
          get: async (key: string) => {
            await ensureInitialized();
            try {
              return await store.get?.(key);
            } catch {
              throw unavailableStore(name, log);
            }
          },
        }
      : {}),
    ...(store.init
      ? {
          init: (options: Options) => {
            initialization = (async () => {
              try {
                await store.init?.(options);
              } catch {
                initializationFailed = true;
              }
            })();
            return initialization;
          },
        }
      : {}),
    ...(store.resetAll
      ? {
          resetAll: async () => {
            await ensureInitialized();
            try {
              await store.resetAll?.();
            } catch {
              throw unavailableStore(name, log);
            }
          },
        }
      : {}),
    ...(store.shutdown
      ? {
          shutdown: async () => {
            await ensureInitialized();
            try {
              await store.shutdown?.();
            } catch {
              throw unavailableStore(name, log);
            }
          },
        }
      : {}),
    ...(store.localKeys === undefined ? {} : { localKeys: store.localKeys }),
    ...(store.prefix === undefined ? {} : { prefix: store.prefix }),
  };

  return guarded;
}

/** A store and its failure behavior are mandatory; no default memory store is used. */
export function createRateLimiter({
  name,
  limit,
  windowMs,
  store,
  storeFailurePolicy,
  log = writeLog,
}: RateLimitConfiguration) {
  if (!store) {
    throw new Error('An explicit rate-limit store is required.');
  }
  if (!Number.isInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs < 1) {
    throw new Error('Rate-limit settings must be positive values.');
  }
  if (!['fail-closed', 'fail-open'].includes(storeFailurePolicy)) {
    throw new Error('A rate-limit store failure policy must be selected.');
  }

  const options: Partial<Options> = {
    windowMs,
    limit,
    store: guardedStore(store, name, log),
    passOnStoreError: storeFailurePolicy === 'fail-open',
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_request, response) => {
      response.status(429).json({
        error: {
          code: 'RATE_LIMITED',
          message: 'Request could not be processed.',
        },
      });
    },
    // Preserve operational signals without forwarding raw library errors/messages.
    logger: {
      error: () => safeWriteLog(log, { event: 'rate_limit_library_error', policy: name }),
      warn: () => safeWriteLog(log, { event: 'rate_limit_configuration_warning', policy: name }),
    },
  };

  return rateLimit(options);
}
