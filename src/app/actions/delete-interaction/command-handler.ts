// src/app/actions/delete-interaction/command-handler.ts
import type { AppState } from '@/lib/types';
import type { DeleteInteractionCommand } from './command';
import { createInteractionDeletedEvent } from './event';

export function handleDeleteInteractionCommand(state: AppState, command: DeleteInteractionCommand) {
  // Business rules could be added here.
  const event = createInteractionDeletedEvent(command.interactionId);
  return event;
}
