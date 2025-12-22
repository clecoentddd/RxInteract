// src/app/actions/update-interaction/reducer.ts
import type { AppState, Interaction, InteractionSeverity, AppEvent } from '@/lib/types';

export function interactionUpdatedReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'InteractionUpdated') {
    return state;
  }
  const payload = event.payload as Interaction;
  if (state.interactions.has(payload.id)) {
     let severity: InteractionSeverity = '';
     if (payload.reco?.includes('CONTRE-INDICATION')) severity = 'Severe';
     else if (payload.reco?.includes('DECONSEILLEE')) severity = 'Moderate';
     else if (payload.reco) severity = 'Mild';

     const existingInteraction = state.interactions.get(payload.id)!;
     state.interactions.set(payload.id, { 
         ...existingInteraction,
         ...payload,
         description: Array.isArray(payload.description) ? payload.description.join(' ') : payload.description,
         severity
     });
  }
  return state;
}
