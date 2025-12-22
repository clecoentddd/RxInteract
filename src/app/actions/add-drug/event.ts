// src/app/actions/add-drug/event.ts
import type { AppEvent } from '@/lib/types';

export function createDrugAddedEvent(drugName: string): AppEvent {
  return {
    metadata: {
      event_type: 'DrugAdded',
      timestamp: Date.now() / 1000,
      uuid: `drug_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload: {
      drug: drugName.toUpperCase(),
      drug_details: [],
    },
  };
}
