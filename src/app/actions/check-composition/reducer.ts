// src/app/actions/check-composition/reducer.ts
import type { AppState, CompositionCheckedPayload, AppEvent, CompositionResult } from '@/lib/types';

export function compositionCheckedReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'CompositionChecked') {
    return state;
  }
  
  const payload = event.payload as CompositionCheckedPayload;

  const result: CompositionResult = {
      drugId: payload.drugId,
      count: payload.count,
      error: payload.error,
      timestamp: event.metadata.timestamp
  }
  
  state.compositionResults.set(payload.drugId, result);
  
  return state;
}
