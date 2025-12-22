import type { AppState } from '@/lib/types';

export function createInitialState(): AppState {
    return {
        drugs: new Map(),
        interactions: new Map(),
    };
}
