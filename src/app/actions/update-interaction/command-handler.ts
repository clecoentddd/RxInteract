// src/app/actions/update-interaction/command-handler.ts
import type { AppState } from '@/lib/types';
import type { UpdateInteractionCommand } from './command';
import { createInteractionUpdatedEvent } from './event';

export function handleUpdateInteractionCommand(state: AppState, command: UpdateInteractionCommand) {
  const existingInteraction = state.interactions.get(command.id);

  if (!existingInteraction) {
    throw new Error('Interaction not found.');
  }

  // Business Rule: Ensure we only update specific fields
  const updatePayload = {
    id: command.id,
    description: command.description,
    reco: command.reco,
    reco_details: command.reco_details,
  };

  // Append Event
  const event = createInteractionUpdatedEvent(updatePayload);
  return event;
}
