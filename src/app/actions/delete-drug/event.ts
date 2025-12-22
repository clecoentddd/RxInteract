// src/app/actions/delete-drug/event.ts
import type { AppEvent } from '@/lib/types';

export function createDrugDeletedEvent(drugId: string): AppEvent {
  return {
    metadata: {
      event_type: 'DrugDeleted',
      timestamp: Date.now() / 1000,
      uuid: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload: { drugId },
  };
}
