// src/app/actions/lookup-drug/reducer.ts
import type { AppState, DrugFoundPayload, AppEvent, DrugLookupResult } from '@/lib/types';

export function drugFoundReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'DrugFound') {
    return state;
  }
  
  const payload = event.payload as DrugFoundPayload;

  const result: DrugLookupResult = {
      drugName: payload.drugName,
      data: payload.data,
      error: payload.error,
      timestamp: event.metadata.timestamp
  }
  
  state.drugLookupResults.set(payload.drugName, result);
  
  return state;
}
