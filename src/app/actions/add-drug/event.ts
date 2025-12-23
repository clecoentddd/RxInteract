// src/app/actions/add-drug/event.ts
import type { AppEvent } from '@/lib/types';
import type { AddDrugCommand } from './command';

export function createDrugAddedEvent(command: AddDrugCommand): AppEvent {
  return {
    metadata: {
      event_type: 'DrugAdded',
      timestamp: Date.now() / 1000,
      uuid: `drug_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload: {
      drug: command.name.toUpperCase(),
      drug_details: command.details?.split('\n').filter(Boolean) || [],
    },
  };
}
