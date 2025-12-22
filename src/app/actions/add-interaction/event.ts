// src/app/actions/add-interaction/event.ts
import type { AppEvent } from '@/lib/types';
import type { AddInteractionCommand } from './command';

export function createInteractionAddedEvent(command: AddInteractionCommand): AppEvent {
  return {
    metadata: {
      event_type: 'InteractionAdded',
      timestamp: Date.now() / 1000,
      uuid: `int_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
    payload: {
      drug_uuid: command.drug1Id, // Maintain compatibility with older format if needed
      drug1Id: command.drug1Id,
      drug2Id: command.drug2Id,
      description: command.description.split('\n').filter(Boolean),
      reco: command.reco,
      reco_details: command.reco_details.join('\n').split('\n').filter(Boolean),
    },
  };
}
