// src/app/actions/update-drug/reducer.ts
import type { AppState, DrugUpdatedPayload, AppEvent } from '@/lib/types';

export function drugUpdatedReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'DrugUpdated') {
    return state;
  }
  
  const payload = event.payload as DrugUpdatedPayload;
  const existingDrug = state.drugs.get(payload.id);

  if (existingDrug) {
    state.drugs.set(payload.id, {
      ...existingDrug,
      name: payload.name,
      details: payload.details,
    });
  }
  
  return state;
}
