let lastPersistenceError: Error | undefined;

export function setPersistenceError(error: unknown) {
  lastPersistenceError = error instanceof Error ? error : new Error('Learning state persistence failed.');
}

export function getPersistenceError() {
  return lastPersistenceError;
}