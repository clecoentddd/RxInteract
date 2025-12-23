// src/app/actions/check-composition/command-handler.ts
"use server";
import type { AppState } from '@/lib/types';
import type { CheckCompositionCommand } from './command';
import { createCompositionCheckedEvent } from './event';

export async function handleCheckCompositionCommand(state: AppState, command: CheckCompositionCommand) {
  // This function now queries the in-memory state derived from events.json
  // The logic mimics searching for how many times a drug is a component in others.
  
  let count = 0;
  try {
    const drugNameToFind = command.drugName.toLowerCase();
    
    // Search through the 'details' of all other drugs
    for (const drug of state.drugs.values()) {
        if (drug.details && Array.isArray(drug.details)) {
            for (const detail of drug.details) {
                if (detail.toLowerCase().includes(drugNameToFind)) {
                    count++;
                }
            }
        }
    }

     // Search through the 'description' and 'reco_details' of all interactions
     for (const interaction of state.interactions.values()) {
        if (interaction.description.toLowerCase().includes(drugNameToFind)) {
            count++;
        }
         if (Array.isArray(interaction.reco_details)) {
            for (const detail of interaction.reco_details) {
                if (detail.toLowerCase().includes(drugNameToFind)) {
                    count++;
                }
            }
         }
    }


    const event = createCompositionCheckedEvent({
      drugId: command.drugId,
      count: count,
    });
    return event;

  } catch (error: any) {
    const event = createCompositionCheckedEvent({
      drugId: command.drugId,
      count: 0,
      error: error.message || 'An unknown error occurred while checking composition.',
    });
    return event;
  }
}
