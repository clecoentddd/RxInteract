// src/app/actions/check-composition/event.ts
import type { AppEvent, CompositionCheckedPayload } from '@/lib/types';

export function createCompositionCheckedEvent(payload: CompositionCheckedPayload): AppEvent {
  return {
    metadata: {
      event_type: 'CompositionChecked',
      timestamp: Date.now() / 1000,
      uuid: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload,
  };
}
