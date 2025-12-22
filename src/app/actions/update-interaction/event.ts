// src/app/actions/update-interaction/event.ts
import type { AppEvent } from '@/lib/types';

type UpdatePayload = {
  id: string;
  description: string;
  reco: string;
  reco_details: string[];
};

export function createInteractionUpdatedEvent(payload: UpdatePayload): AppEvent {
  return {
    metadata: {
      event_type: 'InteractionUpdated',
      timestamp: Date.now() / 1000,
      uuid: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload: {
        ...payload,
        description: payload.description.split('\n').filter(Boolean),
        reco_details: payload.reco_details,
    },
  };
}
