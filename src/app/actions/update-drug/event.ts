// src/app/actions/update-drug/event.ts
import type { AppEvent, DrugUpdatedPayload } from '@/lib/types';
import type { UpdateDrugCommand } from './command';

export function createDrugUpdatedEvent(command: UpdateDrugCommand): AppEvent {
  const payload: DrugUpdatedPayload = {
    id: command.id,
    name: command.name,
    details: command.details,
  };

  return {
    metadata: {
      event_type: 'DrugUpdated',
      timestamp: Date.now() / 1000,
      uuid: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload,
  };
}
