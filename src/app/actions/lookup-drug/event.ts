// src/app/actions/lookup-drug/event.ts
import type { AppEvent, DrugFoundPayload } from '@/lib/types';

export function createDrugFoundEvent(payload: DrugFoundPayload): AppEvent {
  return {
    metadata: {
      event_type: 'DrugFound',
      timestamp: Date.now() / 1000,
      uuid: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload,
  };
}
