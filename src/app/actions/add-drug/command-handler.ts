// src/app/actions/add-drug/command-handler.ts
import type { AppState } from '@/lib/types';
import type { AddDrugCommand } from './command';
import { createDrugAddedEvent } from './event';

export function handleAddDrugCommand(state: AppState, command: AddDrugCommand) {
  // Apply business rules
  const existingDrug = Array.from(state.drugs.values()).find(
    (d) => d.name.toLowerCase() === command.name.toLowerCase()
  );

  if (existingDrug) {
    throw new Error('A drug with this name already exists.');
  }

  // Append Event
  const event = createDrugAddedEvent(command.name);
  return event;
}
