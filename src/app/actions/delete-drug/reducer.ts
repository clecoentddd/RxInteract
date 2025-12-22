// src/app/actions/delete-drug/reducer.ts
import type { AppState, AppEvent } from '@/lib/types';

export function drugDeletedReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'DrugDeleted') {
    return state;
  }
  const payload = event.payload as { drugId: string };
  state.drugs.delete(payload.drugId);
  // Also remove interactions involving the deleted drug
  for (const [intId, interaction] of state.interactions.entries()) {
      if (interaction.drug1Id === payload.drugId || interaction.drug2Id === payload.drugId) {
         state.interactions.delete(intId);
      }
  }
  return state;
}
