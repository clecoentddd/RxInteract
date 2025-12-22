// src/app/actions/add-interaction/reducer.ts
import type { AppState, Interaction, InteractionSeverity, AppEvent } from '@/lib/types';

export function interactionAddedReducer(state: AppState, event: AppEvent): AppState {
  if (event.metadata.event_type !== 'InteractionAdded') {
    return state;
  }
  
  const payload = event.payload as any;

  let drug1Id = payload.drug1Id;
  let drug2Id = payload.drug2Id;

  // Legacy support for older events that used names instead of IDs
  if (!drug1Id || !drug2Id) {
      const drugs = Array.from(state.drugs.values());
      const drug1 = drugs.find(d => d.name === payload.drug_name1);
      const drug2 = drugs.find(d => d.name === payload.drug_name2);
      if (drug1) drug1Id = drug1.id;
      if (drug2) drug2Id = drug2.id;
  }

  if (drug1Id && drug2Id) {
      let severity: InteractionSeverity = ''
      if (payload.reco?.includes('CONTRE-INDICATION')) severity = 'Severe';
      else if (payload.reco?.includes('DECONSEILLEE')) severity = 'Moderate';
      else if (payload.reco) severity = 'Mild';


      const interaction: Interaction = {
          id: event.metadata.uuid,
          drug1Id: drug1Id,
          drug2Id: drug2Id,
          severity: severity,
          description: Array.isArray(payload.description) ? payload.description.join(' ') : payload.description,
          reco: payload.reco,
          reco_details: payload.reco_details || [],
      };
      state.interactions.set(interaction.id, interaction);
  }

  return state;
}
