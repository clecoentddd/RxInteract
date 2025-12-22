// src/app/actions/delete-interaction/reducer.ts
import type { AppState, AppEvent } from '@/lib/types';

export function interactionDeletedReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'InteractionDeleted') {
    return state;
  }
  const payload = event.payload as { interactionId: string };
  state.interactions.delete(payload.interactionId);
  return state;
}
