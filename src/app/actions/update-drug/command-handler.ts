// src/app/actions/update-drug/command-handler.ts
import type { AppState } from '@/lib/types';
import type { UpdateDrugCommand } from './command';
import { createDrugUpdatedEvent } from './event';

export function handleUpdateDrugCommand(state: AppState, command: UpdateDrugCommand) {
  // Business Rule: Drug must exist.
  if (!state.drugs.has(command.id)) {
    throw new Error('Drug not found.');
  }

  // Business Rule: New name must not conflict with another existing drug.
  const existingDrugWithNewName = Array.from(state.drugs.values()).find(
    (d) => d.name.toLowerCase() === command.name.toLowerCase() && d.id !== command.id
  );

  if (existingDrugWithNewName) {
    throw new Error('Another drug with this name already exists.');
  }

  // Append Event
  const event = createDrugUpdatedEvent(command);
  return event;
}
