// src/app/actions/add-drug/reducer.ts
import type { AppState, Drug, AppEvent } from '@/lib/types';

export function drugAddedReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'DrugAdded') {
    return state;
  }
  const payload = event.payload as { drug: string };
  const drug: Drug = { id: event.metadata.uuid, name: payload.drug };
  state.drugs.set(drug.id, drug);
  return state;
}
