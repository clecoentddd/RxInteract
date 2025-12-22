import type { AppEvent, AppState, Drug, Interaction, InteractionSeverity } from './types';

export function createInitialState(): AppState {
    return {
        drugs: new Map<string, Drug>(),
        interactions: new Map<string, Interaction>(),
    };
}

// This function applies a single event to the state. It is used with reduce.
export function applyEvent(state: AppState, event: AppEvent): AppState {
    switch (event.metadata.event_type) {
        case 'DrugAdded': {
            const payload = event.payload as { drug: string, uuid?: string };
            const drug: Drug = { id: event.metadata.uuid, name: payload.drug };
            state.drugs.set(drug.id, drug);
            break;
        }
        case 'DrugDeleted': {
             const payload = event.payload as { drugId: string };
             state.drugs.delete(payload.drugId);
             // Also remove interactions involving the deleted drug
             for (const [intId, interaction] of state.interactions.entries()) {
                 if (interaction.drug1Id === payload.drugId || interaction.drug2Id === payload.drugId) {
                    state.interactions.delete(intId);
                 }
             }
             break;
        }
        case 'InteractionAdded': {
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
                let severity: InteractionSeverity = payload.severity || '';
                if (!severity) { // Derive severity for older events
                    if (payload.reco?.includes('CONTRE-INDICATION')) severity = 'Severe';
                    else if (payload.reco?.includes('DECONSEILLEE')) severity = 'Moderate';
                    else severity = 'Mild';
                }

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
            break;
        }
        case 'InteractionUpdated': {
            const payload = event.payload as Interaction;
             if (state.interactions.has(payload.id)) {
                let severity: InteractionSeverity = payload.severity || '';
                if (!severity) { // Derive severity if not present
                    if (payload.reco?.includes('CONTRE-INDICATION')) severity = 'Severe';
                    else if (payload.reco?.includes('DECONSEILLEE')) severity = 'Moderate';
                    else severity = 'Mild';
                }
                const existingInteraction = state.interactions.get(payload.id)!;
                state.interactions.set(payload.id, { 
                    ...existingInteraction,
                    ...payload,
                    description: Array.isArray(payload.description) ? payload.description.join(' ') : payload.description,
                    severity
                });
            }
            break;
        }
        case 'InteractionDeleted': {
            const payload = event.payload as { interactionId: string };
            state.interactions.delete(payload.interactionId);
            break;
        }
    }
    return state;
}
