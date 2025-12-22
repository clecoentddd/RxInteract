// src/app/actions/add-interaction/command-handler.ts
import type { AppState } from '@/lib/types';
import type { AddInteractionCommand } from './command';
import { createInteractionAddedEvent } from './event';

export function handleAddInteractionCommand(state: AppState, command: AddInteractionCommand) {
  // Business Rule: The two drugs must be different.
  if (command.drug1Id === command.drug2Id) {
    throw new Error('The two drugs must be different.');
  }

  // Business Rule: Interaction must not already exist.
  const interactionExists = Array.from(state.interactions.values()).some(
    (i) =>
      (i.drug1Id === command.drug1Id && i.drug2Id === command.drug2Id) ||
      (i.drug1Id === command.drug2Id && i.drug2Id === command.drug1Id)
  );

  if (interactionExists) {
    throw new Error('An interaction between these two drugs already exists.');
  }

  // Append Event
  const event = createInteractionAddedEvent(command);
  return event;
}
