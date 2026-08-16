/**
 * networkBus.ts
 * Global event bus for terminal → background communication.
 * Uses a simple pub/sub model with no React deps (pure vanilla).
 */

type NetworkEvent =
  | { type: 'click-expand'; x: number; y: number }
  | { type: 'elite-mode'; active: boolean }
  | { type: 'command-pulse' }
  | { type: 'signal'; x: number; y: number };

type Handler = (event: NetworkEvent) => void;

const handlers = new Set<Handler>();

export const networkBus = {
  emit(event: NetworkEvent) {
    handlers.forEach((h) => h(event));
  },
  on(handler: Handler) {
    handlers.add(handler);
    return () => handlers.delete(handler);
  },
};

/** Call this from a React component to trigger effects */
export function emitNetworkSignal(type: NetworkEvent['type'], extra?: Partial<NetworkEvent>) {
  networkBus.emit({ type, ...extra } as NetworkEvent);
}
