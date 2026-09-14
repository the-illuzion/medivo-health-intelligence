type AppleHealthSyncListener = () => void;

const listeners = new Set<AppleHealthSyncListener>();

export function notifyAppleHealthSyncCompleted(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeToAppleHealthSync(listener: AppleHealthSyncListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
