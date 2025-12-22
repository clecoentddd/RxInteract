// src/app/actions/delete-interaction/event.ts
import type { AppEvent } from '@/lib/types';

export function createInteractionDeletedEvent(interactionId: string): AppEvent {
  return {
    metadata: {
      event_type: 'InteractionDeleted',
      timestamp: Date.now() / 1000,
      uuid: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload: { interactionId },
  };
}
